import { Router } from "express";
const router = Router();
import upload from "../middleware/multer.js";
import SessionController from "../controllers/SessionController.js";
import JWT from "../middleware/JWT.js";

//login
router.post("/create", JWT.verifyToken, SessionController.CreateNewSession);
//get sessions
router.post(
  "/getSessions",
  JWT.verifyToken,
  SessionController.GetAllTeacherSessions
);
//get QR
router.post("/getQR", JWT.verifyToken, SessionController.GetQR);
//attend session
router.post(
  "/attend_session",
  JWT.verifyToken,
  upload.single("image"),
  SessionController.AttendSession
);
//get student sessions
router.post(
  "/getStudentSessions",
  JWT.verifyToken,
  SessionController.GetStudentSessions
);
//get current running sessions
router.post(
  "/getCurrentSessions",
  JWT.verifyToken,
  SessionController.GetCurrentSessions
);
//get performance data
router.post(
  "/getPerformanceData",
  JWT.verifyToken,
  SessionController.GetPerformanceData
);
//save CT marks
router.post(
  "/saveCTMarks",
  JWT.verifyToken,
  SessionController.SaveCTMarks
);

export default router;
