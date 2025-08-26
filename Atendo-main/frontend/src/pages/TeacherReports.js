import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "../components/SideNav";
import "../styles/TeacherReports.css";

const TeacherReports = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [sessionList, setSessionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Get teacher sessions
  function getTeacherSessions() {
    setLoading(true);
    axios
      .post("http://localhost:5000/sessions/getSessions", {
        token: token,
      })
      .then((response) => {
        setSessionList(response.data.sessions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching teacher sessions:", err);
        setSessionList([]);
        setLoading(false);
      });
  }

  // Calculate overall statistics
  const calculateStats = () => {
    const totalSessions = sessionList.length;
    const totalStudents = sessionList.reduce((sum, session) => sum + (session.attendance?.length || 0), 0);
    const totalPresent = sessionList.reduce((sum, session) => {
      return sum + (session.attendance?.filter(student => 
        parseFloat(student.distance) <= parseFloat(session.radius)
      ).length || 0);
    }, 0);
    const totalLate = totalStudents - totalPresent;
    const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

    return { totalSessions, totalStudents, totalPresent, totalLate, attendanceRate };
  };

  const stats = calculateStats();

  // Filter sessions based on search and status
  const filteredSessions = sessionList.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    
    const hasAttendance = session.attendance && session.attendance.length > 0;
    if (filterStatus === "with-attendance") return matchesSearch && hasAttendance;
    if (filterStatus === "no-attendance") return matchesSearch && !hasAttendance;
    
    return matchesSearch;
  });

  useEffect(() => {
    if (token === "" || token === undefined) {
      navigate("/login");
    } else {
      getTeacherSessions();
    }
  }, [token, navigate]);

  return (
    <>
      <div className="app-container">
        <SideNav onCreateSession={() => {}} userType="teacher" />
        <div className="main-content-area">
        <div className="teacher-reports-container">
          <div className="reports-header">
            <h1>📈 Teaching Reports & Analytics</h1>
           
          </div>

          {/* Overall Statistics */}
          <div className="teacher-stats-grid">
            <div className="teacher-stat-card sessions">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.totalSessions}</h3>
                <p>Total Sessions</p>
              </div>
            </div>
            <div className="teacher-stat-card students">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalStudents}</h3>
                <p>Total Attendance</p>
              </div>
            </div>
            <div className="teacher-stat-card present">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.totalPresent}</h3>
                <p>On Time</p>
              </div>
            </div>
            <div className="teacher-stat-card late">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <h3>{stats.totalLate}</h3>
                <p>Late</p>
              </div>
            </div>
            <div className="teacher-stat-card rate">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.attendanceRate}%</h3>
                <p>Attendance Rate</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="teacher-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search sessions by course name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sessions</option>
              <option value="with-attendance">With Attendance</option>
              <option value="no-attendance">No Attendance</option>
            </select>
          </div>

          {/* Sessions Report List */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading session reports...</p>
            </div>
          ) : (
            <div className="teacher-session-reports">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, index) => {
                  const attendanceCount = session.attendance?.length || 0;
                  const onTimeCount = session.attendance?.filter(student => 
                    parseFloat(student.distance) <= parseFloat(session.radius)
                  ).length || 0;
                  const lateCount = attendanceCount - onTimeCount;
                  const sessionRate = attendanceCount > 0 ? Math.round((onTimeCount / attendanceCount) * 100) : 0;

                  return (
                    <div key={index} className="session-report-card">
                      <div className="session-report-header">
                        <div className="session-details">
                          <h3>{session.name}</h3>
                          <div className="session-info-meta">
                            <span className="date">📅 {new Date(session.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                            <span className="time">⏰ {session.time}</span>
                            <span className="duration">⏱️ {session.duration}</span>
                            <span className="radius">📍 {session.radius}m radius</span>
                          </div>
                        </div>
                        
                        <div className="session-stats">
                          <div className="quick-stats">
                            <div className="quick-stat">
                              <span className="number">{attendanceCount}</span>
                              <span className="label">Total</span>
                            </div>
                            <div className="quick-stat success">
                              <span className="number">{onTimeCount}</span>
                              <span className="label">On Time</span>
                            </div>
                            <div className="quick-stat warning">
                              <span className="number">{lateCount}</span>
                              <span className="label">Late</span>
                            </div>
                            <div className="quick-stat rate">
                              <span className="number">{sessionRate}%</span>
                              <span className="label">Rate</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {attendanceCount > 0 && (
                        <div className="attendance-details">
                          <h4>👥 Student Attendance Details:</h4>
                          <div className="student-attendance-grid">
                            {session.attendance.map((student, studentIndex) => {
                              const isOnTime = parseFloat(student.distance) <= parseFloat(session.radius);
                              return (
                                <div key={studentIndex} className="student-attendance-item">
                                  <div className="student-profile">
                                    <img 
                                      src={student.image} 
                                      alt="Student verification" 
                                      className="student-verification-photo"
                                      onClick={() => window.open(student.image, '_blank')}
                                    />
                                    <div className="student-details">
                                      <span className="student-email">{student.student_email}</span>
                                      <span className="attendance-time">
                                        🕒 {new Date(student.date).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="attendance-metrics">
                                    <span className={`distance-metric ${isOnTime ? 'success' : 'warning'}`}>
                                      📍 {student.distance}m
                                    </span>
                                    <span className={`status-badge ${isOnTime ? 'on-time' : 'late'}`}>
                                      {isOnTime ? '✅ On Time' : '⚠️ Late'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="session-actions">
                        <button 
                          className="export-btn"
                          onClick={() => {
                            // Export functionality can be added here
                            console.log('Export session data:', session);
                          }}
                        >
                          📊 Export Data
                        </button>
                        <button 
                          className="details-btn"
                          onClick={() => setSelectedSession(session)}
                        >
                          📋 Full Details
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-sessions-found">
                  <div className="no-sessions-icon">🔍</div>
                  <h3>No sessions found</h3>
                  <p>
                    {searchTerm ? 
                      `No sessions match "${searchTerm}"` : 
                      `No sessions ${filterStatus === 'all' ? '' : 'with ' + filterStatus.replace('-', ' ')} found`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default TeacherReports;
