import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protecRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: no token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "unauthorized invalid token" });
    }

      const user = await User.findById(decoded.userId).select("-password")
      if (!user) {
          return res.status(401).json({error: "User not found"})
      }
      req.user = user
      next()
  } catch (error) {
    console.log("Eror in protecRoute Middleware ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};
