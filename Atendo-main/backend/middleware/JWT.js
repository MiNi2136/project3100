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

const JWT = {
  verifyToken,
  verifyTokenFromBody,
  generateToken,
};

export default JWT;
