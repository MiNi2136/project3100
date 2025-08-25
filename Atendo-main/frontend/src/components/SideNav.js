import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideNav.css";
import logout from "../assets/logout.png";
import home from "../assets/home.png";

const SideNav = ({ onCreateSession, userType = "student" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleDashboard = () => {
    const dashboardUrl = userType === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
    navigate(dashboardUrl);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleCreateSession = () => {
    if (onCreateSession) {
      onCreateSession();
    }
  };

  const handleReports = () => {
    const reportsUrl = userType === "teacher" ? "/teacher-reports" : "/reports";
    navigate(reportsUrl);
  };

  const handleSessions = () => {
    navigate("/sessions");
  };

  return (
    <div className="sidenav">
      <div className="sidenav-content">
        <div className="nav-items">
          <button onClick={handleDashboard} className="nav-item">
            <img src={home} alt="Dashboard" />
            <span>Dashboard</span>
          </button>
          
          <button onClick={handleProfile} className="nav-item">
            <span>👤</span>
            <span>Profile</span>
          </button>

          {userType === "teacher" && (
            <button onClick={handleCreateSession} className="nav-item create-session-item">
              <span>➕</span>
              <span>Create Session</span>
            </button>
          )}

          <button onClick={handleSessions} className="nav-item">
            <span>📊</span>
            <span>Sessions</span>
          </button>

          <button onClick={handleReports} className="nav-item">
            <span>📈</span>
            <span>Reports</span>
          </button>

          <button className="nav-item">
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
        
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-btn">
            <img src={logout} alt="Logout" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
