import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import StudentForm from "./StudentForm";
import QRScanner from "../components/QRScanner";
import SideNav from "../components/SideNav";
const queryParameters = new URLSearchParams(window.location.search);

const Dashboard = () => {
  //eslint-disable-next-line
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // eslint-disable-next-line
  const [sessionList, setSessionList] = useState([]);
  const [isSessionDisplay, setSessionDisplay] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [currentSessions, setCurrentSessions] = useState([]);
  const navigate = useNavigate();

  function getStudentSessions() {
    axios
      .post("http://localhost:5000/sessions/getStudentSessions", {
        token: token,
      })
      .then((response) => {
        setSessionList(response.data.sessions);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getCurrentSessions() {
    axios
      .post("http://localhost:5000/sessions/getCurrentSessions", {
        token: token,
      })
      .then((response) => {
        setCurrentSessions(response.data.sessions || []);
      })
      .catch((error) => {
        console.log("Error fetching current sessions:", error);
        // If API doesn't exist, we'll just show empty current sessions
        setCurrentSessions([]);
      });
  }

  function toggleStudentForm(action) {
    if (action === "open") {
      setSessionDisplay(true);
    } else {
      localStorage.removeItem("session_id");
      localStorage.removeItem("teacher_email");
      setSessionDisplay(false);
      navigate("/student-dashboard");
    }
  }

  function getDistance(distance, radius) {
    return {
      distance,
      color: distance <= parseFloat(radius) ? "green" : "red",
    };
  }

  function handleQRScan(scannedData) {
    try {
      // Parse the scanned QR data - expecting format: session_id=xxx&email=xxx
      const url = new URL(scannedData);
      const sessionId = url.searchParams.get("session_id");
      const teacherEmail = url.searchParams.get("email");
      
      if (sessionId && teacherEmail) {
        localStorage.setItem("session_id", sessionId);
        localStorage.setItem("teacher_email", teacherEmail);
        setShowQRScanner(false);
        toggleStudentForm("open");
      } else {
        alert("Invalid QR code. Please scan a valid attendance QR code.");
      }
    } catch (error) {
      // Try alternative parsing for different QR format
      if (scannedData.includes("session_id") && scannedData.includes("email")) {
        const params = new URLSearchParams(scannedData.split('?')[1] || scannedData);
        const sessionId = params.get("session_id");
        const teacherEmail = params.get("email");
        
        if (sessionId && teacherEmail) {
          localStorage.setItem("session_id", sessionId);
          localStorage.setItem("teacher_email", teacherEmail);
          setShowQRScanner(false);
          toggleStudentForm("open");
        } else {
          alert("Invalid QR code format.");
        }
      } else {
        alert("Invalid QR code. Please scan a valid attendance QR code.");
      }
    }
  }

  useEffect(() => {
    if (token === "" || token === undefined) {
      navigate("/login");
    } else {
      // Check if user is actually a student
      const userType = localStorage.getItem("type");
      if (userType === "teacher") {
        // If user is a teacher, redirect to teacher dashboard
        navigate("/teacher-dashboard");
        return;
      }
      getStudentSessions();
      getCurrentSessions();
      try {
        if (
          queryParameters.get("session_id") !== null &&
          queryParameters.get("email") !== null
        ) {
          localStorage.setItem("session_id", queryParameters.get("session_id"));
          localStorage.setItem("teacher_email", queryParameters.get("email"));
        }
        if (
          localStorage.getItem("session_id") == null &&
          localStorage.getItem("teacher_email") == null
        ) {
          toggleStudentForm("close");
        } else {
          toggleStudentForm("open");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [token]);

  return (
    <>
      <div className="app-container">
        <SideNav userType="student" />
        <div className="main-content-area">
          <div className="dashboard-main">
          {!isSessionDisplay && (
            <>
              {/* Current Running Sessions */}
            {currentSessions.length > 0 && (
            <div className="current-sessions">
              <h2>📍 Current Running Sessions</h2>
              <div className="current-sessions-grid">
                {currentSessions.map((session, index) => (
                  <div key={`current-${index}`} className="current-session-card">
                    <div className="session-info">
                      <h3>{session.name}</h3>
                      <p>📅 {session.date?.split("T")[0]}</p>
                      <p>🕒 {session.time}</p>
                      <p>📍 {session.location}</p>
                      <p className="teacher-name">👨‍🏫 {session.teacher_name}</p>
                    </div>
                    <div className="qr-section">
                      {session.qr_code && (
                        <img 
                          src={session.qr_code} 
                          alt="QR Code" 
                          className="session-qr"
                        />
                      )}
                      <button 
                        className="scan-btn"
                        onClick={() => setShowQRScanner(true)}
                      >
                        📱 Scan QR Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan QR Button if no current sessions */}
          {currentSessions.length === 0 && (
            <div className="scan-section">
              <h2>📱 Mark Attendance</h2>
              <button 
                className="scan-qr-main-btn"
                onClick={() => setShowQRScanner(true)}
              >
                🔍 Scan QR Code for Attendance
              </button>
              <p className="scan-instruction">Ask your teacher to show the QR code for the current session</p>
            </div>
          )}

          {/* Recent Attendance List */}
          <div className="attendance-section">
            <div className="section-header">
              <h2>📚 Recent Attendance</h2>
              <span className="attendance-count">{sessionList.length} sessions attended</span>
            </div>
            
            {sessionList.length > 0 ? (
              <div className="attendance-list">
                {sessionList.slice(0, 5).map((session, index) => (
                  <div key={index} className="attendance-card">
                    <div className="card-header">
                      <div className="course-info">
                        <h3 className="course-name">{session.name}</h3>
                        <div className="session-meta">
                          <span className="date">📅 {new Date(session.date).toLocaleDateString()}</span>
                          <span className="time">⏰ {session.time}</span>
                          <span className="duration">⏱️ {session.duration}</span>
                        </div>
                      </div>
                      <div className="attendance-status">
                        <span className={`status-badge ${
                          getDistance(session.distance, session.radius).color === 'green' 
                            ? 'present' 
                            : 'late'
                        }`}>
                          {getDistance(session.distance, session.radius).color === 'green' 
                            ? '✅ Present' 
                            : '⚠️ Late'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-details">
                      <div className="detail-item">
                        <span className="label">Distance:</span>
                        <span className={`value distance-value ${
                          getDistance(session.distance, session.radius).color
                        }`}>
                          {session.distance}m (Limit: {session.radius}m)
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Photo:</span>
                        <img 
                          src={session.image} 
                          alt="Attendance proof" 
                          className="attendance-photo"
                          onClick={() => window.open(session.image, '_blank')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {sessionList.length > 5 && (
                  <div className="view-all-container">
                    <button className="view-all-btn">
                      View All {sessionList.length} Sessions →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-attendance">
                <div className="no-attendance-icon">📋</div>
                <h3>No attendance records yet</h3>
                <p>Your attendance history will appear here once you start marking attendance</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* QR Scanner */}
      <QRScanner 
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
      
      {/* Student Form */}
      {isSessionDisplay && (
        <div className="popup-overlay">
          <StudentForm togglePopup={toggleStudentForm} />
        </div>
      )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
