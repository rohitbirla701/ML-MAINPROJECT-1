import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization); // DEBUG
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token to verify:", token); // DEBUG
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;