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
  let tokenData = req.user;
  let { session_id, teacher_email, regno, IP, student_email, Location, date } =
    req.body;
  let imageName = req.file.filename;

  try {
    let present = false;
    const teacher = await Teacher.findOne({ email: teacher_email });
    let session_details = {};
    teacher.sessions.map(async (session) => {
      if (session.session_id === session_id) {
        let distance = checkStudentDistance(Location, session.location);
        session.attendance.map((student) => {
          if (
            student.regno === regno ||
            student.student_email === student_email
          ) {
            present = true;
          }
        });
        if (!present) {
          res.status(200).json({ message: "Attendance marked successfully" });
          await uploadImage(imageName).then((result) => {
            session_details = {
              session_id: session.session_id,
              teacher_email: teacher.email,
              name: session.name,
              date: session.date,
              time: session.time,
              duration: session.duration,
              distance: distance,
              radius: session.radius,
              image: result,
            };
            session.attendance.push({
              regno,
              image: result,
              date,
              IP,
              student_email: tokenData.email,
              Location,
              distance,
            });
          });
          await Teacher.findOneAndUpdate(
            { email: teacher_email },
            { sessions: teacher.sessions }
          );
          await Student.findOneAndUpdate(
            { email: student_email },
            { $push: { sessions: session_details } }
          );
        }
      }
    });
    if (present) {
      res.status(200).json({ message: "Attendance already marked" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
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

//get current running sessions (sessions created today and still active)
async function GetCurrentSessions(req, res) {
  try {
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
          currentSessions.push({
            session_id: session.session_id,
            name: session.name,
            date: session.date,
            time: session.time,
            location: session.location,
            teacher_name: teacher.name,
            teacher_email: teacher.email,
            qr_code: getQR(session.session_id, teacher.email)
          });
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

const SessionController = {
  CreateNewSession,
  GetAllTeacherSessions,
  GetQR,
  AttendSession,
  GetStudentSessions,
  GetCurrentSessions,
  GetPerformanceData,
  SaveCTMarks,
};

export default SessionController;
