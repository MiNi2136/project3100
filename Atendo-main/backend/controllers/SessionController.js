import dotenv from "dotenv";
dotenv.config();
import querystring from "querystring";
import { Teacher } from "../model/Teacher.js";
import { Student } from "../model/Student.js";
import uploadImage from "../middleware/cloudinary.js";

function getQR(session_id, email) {
  let url = `${process.env.CLIENT_URL}/login?${querystring.stringify({
    session_id,
    email,
  })}`;
  return url;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
}
function checkStudentDistance(Location1, Location2) {
  Location1 = Location1.split(",");
  Location2 = Location2.split(",");
  const locationLat1 = parseFloat(Location1[0]);
  const locationLon1 = parseFloat(Location1[1]);
  const locationLat2 = parseFloat(Location2[0]);
  const locationLon2 = parseFloat(Location2[1]);

  const distance = haversineDistance(
    locationLat1,
    locationLon1,
    locationLat2,
    locationLon2
  );
  return distance.toFixed(2);
}

//make controller functions

async function CreateNewSession(req, res) {
  let { session_id, name, duration, location, radius, date, time, token } =
    req.body;
  let tokenData = req.user;

  let newSession = {
    session_id,
    date,
    time,
    name,
    duration,
    location,
    radius,
  };

  try {
    let teacher = await Teacher.findOneAndUpdate(
      { email: tokenData.email },
      { $push: { sessions: newSession } }
    );

    res.status(200).json({
      url: getQR(session_id, teacher.email),
      message: "Session created successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
//get sessions
async function GetAllTeacherSessions(req, res) {
  try {
    let tokenData = req.user;
    const teacher = await Teacher.findOne({ email: tokenData.email });
    res.status(200).json({ sessions: teacher.sessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
//get QR
async function GetQR(req, res) {
  try {
    let tokenData = req.user;
    let url = getQR(req.body.session_id, tokenData.email);
    res.status(200).json({ url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//attend session
async function AttendSession(req, res) {
  console.log("AttendSession API called");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("User from token:", req.user);
  
  try {
    const tokenData = req.user;
    const { session_id, teacher_email, regno, IP, Location, date } = req.body;
    
    console.log("Parsed data:", {
      session_id,
      teacher_email,
      regno,
      IP,
      Location,
      date,
      tokenData_email: tokenData?.email
    });
    
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ message: "Image is required for attendance" });
    }
    
    const imageName = req.file.filename;
    console.log("Image uploaded:", imageName);
    
    const teacher = await Teacher.findOne({ email: teacher_email });
    if (!teacher) {
      console.error("Teacher not found:", teacher_email);
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log("Teacher found:", teacher.name);

    // Find the specific session
    let targetSession = null;
    for (let session of teacher.sessions) {
      if (session.session_id === session_id) {
        targetSession = session;
        break;
      }
    }

    if (!targetSession) {
      console.error("Session not found:", session_id, "Available sessions:", teacher.sessions.map(s => s.session_id));
      return res.status(404).json({ message: "Session not found" });
    }
    
    console.log("Target session found:", targetSession.name);

    // Check if student already marked attendance
    let alreadyPresent = false;
    for (let student of targetSession.attendance) {
      if (student.regno === regno || student.student_email === tokenData.email) {
        alreadyPresent = true;
        break;
      }
    }

    if (alreadyPresent) {
      console.log("Student already marked attendance:", regno, tokenData.email);
      return res.status(200).json({ message: "Attendance already marked" });
    }
    
    console.log("Marking attendance for:", regno, tokenData.email);

    // Calculate distance
    const distance = checkStudentDistance(Location, targetSession.location);

    // Upload image and mark attendance
    const imageResult = await uploadImage(imageName);
    
    const session_details = {
      session_id: targetSession.session_id,
      teacher_email: teacher.email,
      name: targetSession.name,
      date: targetSession.date,
      time: targetSession.time,
      duration: targetSession.duration,
      distance: distance,
      radius: targetSession.radius,
      image: imageResult,
    };

    // Add attendance record to session
    targetSession.attendance.push({
      regno,
      image: imageResult,
      date,
      IP,
      student_email: tokenData.email,
      Location,
      distance,
    });

    // Update teacher's sessions
    await Teacher.findOneAndUpdate(
      { email: teacher_email },
      { sessions: teacher.sessions }
    );

    // Update student's sessions
    await Student.findOneAndUpdate(
      { email: tokenData.email },
      { $push: { sessions: session_details } }
    );

    console.log("Attendance marked successfully");
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("AttendSession error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Server error: " + err.message });
  }
}

//get student sessions
async function GetStudentSessions(req, res) {
  let tokenData = req.user;
  try {
    const student = await Student.findOne({
      email: tokenData.email,
    });
    res.status(200).json({ sessions: student.sessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get detailed attendance reports for teacher
async function GetTeacherAttendanceReports(req, res) {
  let tokenData = req.user;
  try {
    const teacher = await Teacher.findOne({ email: tokenData.email });
    
    // Enhanced session data with student information
    const enhancedSessions = await Promise.all(
      teacher.sessions.map(async (session) => {
        const attendanceWithStudentData = await Promise.all(
          session.attendance.map(async (attendance) => {
            const student = await Student.findOne({ email: attendance.student_email });
            return {
              ...attendance.toObject(),
              student_name: student?.name || 'Unknown',
              student_regno: attendance.regno || 'N/A',
              student_email: attendance.student_email,
              ct_marks: attendance.ct_marks || {},
              status: parseFloat(attendance.distance) <= parseFloat(session.radius) ? 'Present' : 'Late',
              attendance_time: new Date(attendance.date).toLocaleString(),
            };
          })
        );

        return {
          ...session.toObject(),
          attendance: attendanceWithStudentData,
          total_students: attendanceWithStudentData.length,
          present_count: attendanceWithStudentData.filter(a => a.status === 'Present').length,
          late_count: attendanceWithStudentData.filter(a => a.status === 'Late').length,
        };
      })
    );

    res.status(200).json({ sessions: enhancedSessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//get current running sessions (sessions created today and currently active based on time and duration)
async function GetCurrentSessions(req, res) {
  try {
    const now = new Date();
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Find all teachers who have sessions created today
    const teachers = await Teacher.find({
      "sessions.date": {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    const currentSessions = [];
    
    teachers.forEach(teacher => {
      teacher.sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        if (sessionDate >= startOfDay && sessionDate < endOfDay) {
          // Check if session is currently running based on time and duration
          const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
          
          // Parse session start time (assuming format like "14:30" or "2:30 PM")
          let sessionStartMinutes = 0;
          try {
            if (session.time.includes(':')) {
              const timeParts = session.time.toLowerCase().split(':');
              let hours = parseInt(timeParts[0]);
              let minutes = parseInt(timeParts[1]);
              
              // Handle 12-hour format with AM/PM
              if (session.time.toLowerCase().includes('pm') && hours !== 12) {
                hours += 12;
              } else if (session.time.toLowerCase().includes('am') && hours === 12) {
                hours = 0;
              }
              
              sessionStartMinutes = hours * 60 + minutes;
            }
          } catch (error) {
            console.log("Error parsing session time:", session.time);
            return; // Skip this session if time parsing fails
          }
          
          // Parse duration (assuming format like "60 min" or "1.5 hours")
          let durationMinutes = 60; // default duration
          try {
            if (session.duration) {
              const durationStr = session.duration.toLowerCase();
              if (durationStr.includes('hour')) {
                const hours = parseFloat(durationStr.replace(/[^0-9.]/g, ''));
                durationMinutes = hours * 60;
              } else if (durationStr.includes('min')) {
                durationMinutes = parseInt(durationStr.replace(/[^0-9]/g, ''));
              } else {
                // Assume it's just a number representing minutes
                durationMinutes = parseInt(session.duration) || 60;
              }
            }
          } catch (error) {
            console.log("Error parsing duration:", session.duration);
            durationMinutes = 60; // fallback to 1 hour
          }
          
          const sessionEndMinutes = sessionStartMinutes + durationMinutes;
          
          // Check if current time is within session time range
          // Also add a buffer (15 minutes before start for early arrivals)
          const bufferMinutes = 15;
          const sessionStartWithBuffer = sessionStartMinutes - bufferMinutes;
          
          if (currentTime >= sessionStartWithBuffer && currentTime <= sessionEndMinutes) {
            currentSessions.push({
              session_id: session.session_id,
              name: session.name,
              date: session.date,
              time: session.time,
              duration: session.duration,
              location: session.location,
              teacher_name: teacher.name,
              teacher_email: teacher.email,
              qr_code: getQR(session.session_id, teacher.email),
              radius: session.radius,
              status: currentTime >= sessionStartMinutes ? 'active' : 'starting_soon'
            });
          }
        }
      });
    });

    res.status(200).json({ sessions: currentSessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//get performance data for teacher (attendance with reg numbers)
async function GetPerformanceData(req, res) {
  let tokenData = req.user;
  try {
    const teacher = await Teacher.findOne({
      email: tokenData.email,
    });
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Compile performance data with registration numbers
    const performanceData = {};
    const sessionsData = [];

    teacher.sessions.forEach(session => {
      // Add session info
      sessionsData.push({
        session_id: session.session_id,
        name: session.name,
        date: session.date,
        time: session.time,
        duration: session.duration,
        location: session.location,
        radius: session.radius,
        attendance_count: session.attendance ? session.attendance.length : 0
      });

      if (session.attendance && session.attendance.length > 0) {
        session.attendance.forEach(attendance => {
          const studentKey = attendance.regno || attendance.student_email;
          
          if (!performanceData[studentKey]) {
            performanceData[studentKey] = {
              regno: attendance.regno || 'N/A',
              email: attendance.student_email,
              attendance_records: [],
              total_sessions_attended: 0,
              total_sessions_on_time: 0,
              ct_marks: attendance.ct_marks || {} // Include CT marks
            };
          }
          
          const isOnTime = parseFloat(attendance.distance) <= parseFloat(session.radius);
          
          performanceData[studentKey].attendance_records.push({
            session_id: session.session_id,
            session_name: session.name,
            date: session.date,
            time: session.time,
            distance: attendance.distance,
            image: attendance.image,
            status: isOnTime ? 'Present' : 'Late',
            is_on_time: isOnTime
          });
          
          performanceData[studentKey].total_sessions_attended += 1;
          if (isOnTime) {
            performanceData[studentKey].total_sessions_on_time += 1;
          }
        });
      }
    });

    // Convert to array and calculate percentages
    const studentPerformanceArray = Object.keys(performanceData).map(studentKey => {
      const student = performanceData[studentKey];
      const totalSessions = teacher.sessions.length;
      const attendancePercentage = totalSessions > 0 ? Math.round((student.total_sessions_attended / totalSessions) * 100) : 0;
      const punctualityPercentage = student.total_sessions_attended > 0 ? Math.round((student.total_sessions_on_time / student.total_sessions_attended) * 100) : 0;
      
      return {
        regno: student.regno,
        email: student.email,
        attendance_records: student.attendance_records,
        total_sessions: totalSessions,
        sessions_attended: student.total_sessions_attended,
        sessions_on_time: student.total_sessions_on_time,
        attendance_percentage: attendancePercentage,
        punctuality_percentage: punctualityPercentage,
        ct_marks: student.ct_marks || {} // Include CT marks
      };
    });

    res.status(200).json({ 
      performance_data: studentPerformanceArray,
      sessions: sessionsData,
      total_sessions: teacher.sessions.length,
      total_students: studentPerformanceArray.length
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//save CT marks for students
async function SaveCTMarks(req, res) {
  let tokenData = req.user;
  let { ct_marks_data } = req.body;

  try {
    const teacher = await Teacher.findOne({
      email: tokenData.email,
    });
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update CT marks for each student in each session they attended
    teacher.sessions.forEach(session => {
      if (session.attendance && session.attendance.length > 0) {
        session.attendance.forEach(attendance => {
          // Find matching CT marks data by regno or email
          const ctData = ct_marks_data.find(data => 
            data.regno === attendance.regno || data.email === attendance.student_email
          );
          
          if (ctData) {
            attendance.ct_marks = ctData.ct_marks;
          }
        });
      }
    });

    // Save updated teacher data
    await Teacher.findOneAndUpdate(
      { email: tokenData.email },
      { sessions: teacher.sessions }
    );

    res.status(200).json({ 
      message: "CT marks saved successfully",
      updated_students: ct_marks_data.length
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Update CT marks for a specific student in a session
async function UpdateCTMarks(req, res) {
  let tokenData = req.user;
  let { session_id, student_email, ct_marks } = req.body;

  try {
    const teacher = await Teacher.findOne({ email: tokenData.email });
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    let updated = false;
    
    // Find the session and student to update CT marks
    teacher.sessions.forEach(session => {
      if (session.session_id === session_id) {
        session.attendance.forEach(attendance => {
          if (attendance.student_email === student_email) {
            attendance.ct_marks = { ...attendance.ct_marks, ...ct_marks };
            updated = true;
          }
        });
      }
    });

    if (updated) {
      await Teacher.findOneAndUpdate(
        { email: tokenData.email },
        { sessions: teacher.sessions }
      );
      
      res.status(200).json({ 
        message: "CT marks updated successfully"
      });
    } else {
      res.status(404).json({ 
        message: "Session or student not found"
      });
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const SessionController = {
  CreateNewSession,
  GetAllTeacherSessions,
  GetQR,
  AttendSession,
  GetStudentSessions,
  GetCurrentSessions,
  GetPerformanceData,
  SaveCTMarks,
  GetTeacherAttendanceReports,
  UpdateCTMarks,
};

export default SessionController;
