import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protecRoute = async (req, res, next) => {
  try {
    let token;
    
    // Cek token di header Authorization
    if (req.header('Authorization')) {
      const authHeader = req.header('Authorization');
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ msg: 'Invalid Authentication. Token is missing or malformed.' });
      }
      token = authHeader.slice(7);
    }

    // Cek token di cookie jwt
    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: no token provided' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.CREATE_TOKEN_REFRESH);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }

    // Temukan pengguna berdasarkan decoded id dan set ke req.user
    const user = await User.findById(decoded.id || decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next(); // Lanjut ke middleware berikutnya
  } catch (error) {
    console.log('Error in authenticateUser middleware:', error.message);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};