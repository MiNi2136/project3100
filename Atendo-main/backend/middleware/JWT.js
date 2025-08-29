import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  // Toverify user Token
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

function verifyTokenFromBody(req, res, next) {
  // Verify token from request body (for API calls)
  const token = req.body.token;
  
  if (!token) return res.status(401).json({ message: "Access Denied - No token provided" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token", error: err.message });
  }
}

function generateToken(data) {
  // Will generate token using user info and server secret key
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "24h" });
}

function verifyTokenDirect(token) {
  // Direct token verification function (not middleware)
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return verified;
  } catch (err) {
    return null;
  }
}

function verifyTokenFromMultipart(req, res, next) {
  // Verify token from multipart form data (after multer processing)
  console.log("verifyTokenFromMultipart called");
  console.log("req.body:", req.body);
  console.log("req.body.token:", req.body.token);
  
  const token = req.body.token;
  
  if (!token) {
    console.log("No token found in multipart request");
    return res.status(401).json({ message: "Access Denied - No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid Token", error: err.message });
  }
}

const JWT = {
  verifyToken,
  verifyTokenFromBody,
  verifyTokenFromMultipart,
  verifyTokenDirect,
  generateToken,
};

export default JWT;
