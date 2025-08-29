import { Router } from "express";
const router = Router();
import upload from "../middleware/multer.js";
import SessionController from "../controllers/SessionController.js";
import JWT from "../middleware/JWT.js";

//login
router.post("/create", JWT.verifyTokenFromBody, SessionController.CreateNewSession);
//get sessions
router.post(
  "/getSessions",
  JWT.verifyTokenFromBody,
  SessionController.GetAllTeacherSessions
);
//get QR
router.post("/getQR", JWT.verifyTokenFromBody, SessionController.GetQR);
//attend session
router.post(
  "/attend_session",
  upload.single("image"),
  JWT.verifyTokenFromMultipart,
  SessionController.AttendSession
);
//get student sessions
router.post(
  "/getStudentSessions",
  JWT.verifyTokenFromBody,
  SessionController.GetStudentSessions
);
//get current running sessions
router.post(
  "/getCurrentSessions",
  JWT.verifyTokenFromBody,
  SessionController.GetCurrentSessions
);
//get performance data
router.post(
  "/getPerformanceData",
  JWT.verifyTokenFromBody,
  SessionController.GetPerformanceData
);
//save CT marks
router.post(
  "/saveCTMarks",
  JWT.verifyTokenFromBody,
  SessionController.SaveCTMarks
);
//get detailed attendance reports
router.post(
  "/getAttendanceReports",
  JWT.verifyTokenFromBody,
  SessionController.GetTeacherAttendanceReports
);
//update CT marks
router.post(
  "/updateCTMarks",
  JWT.verifyTokenFromBody,
  SessionController.UpdateCTMarks
);

export default router;
