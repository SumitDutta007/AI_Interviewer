import { app } from "../configs/firebase.js"
import {getAuth} from "firebase-admin/auth"
import User from "../models/user.model.js";
import crypto from "crypto";
import redis from "../../../shared/redis/redis.js";

export const GoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Firebase token is required" });
    }

    const decodedToken = await getAuth(app).verifyIdToken(token);
    
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
      });
      await user.save();
    }

    const sessionId = crypto.randomUUID();
    
    await redis.set(`session:${sessionId}`, JSON.stringify({
      userId: user._id,
      email: user.email,
      name: user.name,
      interviewCoin: user.interviewCoin
    }), 'EX', 7 * 24 * 60 * 60); // 7 days expiration
    
    res.cookie("session", sessionId, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
    });
    
    return res.status(200).json({ message: "User authenticated", user });

} catch (error) {
  if (error.name === "MongooseError" || error.name === "MongoServerSelectionError" || error.name === "MongoNetworkError") {
    console.error("Google login unavailable because MongoDB is unreachable:", error.message);
    return res.status(503).json({ message: "Authentication service temporarily unavailable" });
  }

  console.error("[auth] Google login failed:", error.code || error.message);
  res.status(401).json({ message: "Invalid token" });
}
}

export const logout = async (req, res) => {
  try{
    const sessionId = req.cookies.session;
    if(sessionId){
      await redis.del(`session:${sessionId}`);
      res.clearCookie("session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
      });
      return res.status(200).json({ 
        success: true,
        message: "User logged out" 
      });
    } else {
      return res.status(400).json({ message: "No session found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}