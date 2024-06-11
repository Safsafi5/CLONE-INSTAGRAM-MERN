import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { validateEmail, validatePassword } from "../utils/validation.util.js";
import {
  createActivationToken,
  createRefreshToken,
  generateTokenAndSetCookie,
} from "../utils/generateToken.util.js";
import newSendEmail from "../utils/service/auth/sendEmail.service.js";
import sendPasswordResetEmail from "../utils/service/auth/resetPassword.service.js";
import sendPasswordResetConfirmationEmail from "../utils/service/auth/resetPasswordConfirm.service.js";

const { CLIENT_URL } = process.env;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword)
      return res.status(400).json({ msg: "Please fill in all field" });

    if (!validateEmail(email))
      return res.status(400).json({ msg: "Invalid email" });

    const existengUsername = await User.findOne({ username });
    if (existengUsername)
      return res.status(400).json({ msg: "This Username is already in use" });

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "This email is already in use" });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match" });

    if (!validatePassword(password))
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and contain at least one alphabet, one digit, and one special character",
      });

    const passwordHash = await bcrypt.hash(password, 12);
    console.log({ passwordHash, password });

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      activated: 0,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
    }
    const activation_token = createActivationToken({ email });
    const url = `${CLIENT_URL}/user/activation/${activation_token}`;

    newSendEmail(email, url, "Verify Your Email");
    res.json({
      msg: "Registration successful! Please check your email to activate your account",
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const activate = async (req, res) => {
  try {
    const { activateEmail } = req.body;
    const user = jwt.verify(activateEmail, process.env.CREATE_TOKEN_ACTIVATION);

    const { email } = user;
    await User.findOneAndUpdate({ email }, { isActivated: 1 });
    res.json({ msg: "Account has been activated!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { email } = req.body;

    // check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "This email does not exist" });
    }

    // check if the previous token is not expired
    if (
      user.activationTokenExpires &&
      user.activationTokenExpires > Date.now()
    ) {
      // If the token has not expired, do not resend the activation email
      const formattedExpirationTime = new Date(
        user.activationTokenExpires
      ).toLocaleString();

      return res.status(400).json({
        msg: "Previous activation token is still valid. Please wait until it expires.",
        expirationTime: formattedExpirationTime, // Add expiration time to the response
      });
    }

    // If the token has expired or not set yet, resend the activation email
    const activate_token = createActivationToken({ email });
    const url = `${CLIENT_URL}/user/activation/${activate_token}`;

    // Set the expiration time of the new token to 5 minutes from now
    const expirationsTime = 5 * 60 * 1000;
    user.activationTokenExpires = Date.now() + expirationsTime;
    await user.save();

    // Format the expiration time to be human-readable
    const formattedExpirationTime = new Date(
      user.activationTokenExpires
    ).toLocaleString();

    newSendEmail(email, url, "Verify Your Email", formattedExpirationTime);

    return res.json({
      msg: "Activation email has been sent again. Please check your email",
      expirationTime: formattedExpirationTime, // Add expiration time to the response
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user.isActivated)
      return res.status(400).json({ msg: "Please activate your account" });

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch || !user)
      return res.status(400).json({ msg: "Incorrect password or email" });

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isActivated: user.isActivated,
      followers: user.followers,
      following: user.following,
      likedPosts: user.likedPosts,
      savedPosts: user.savedPosts,
      bio: user.bio,
      role: user.role,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("error in logging controller ", error.message);
    return res.status(500).json({ msg: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Incorrect email" });

    const acces_token = createRefreshToken({ id: user._id });
    const url = `${CLIENT_URL}/user/reset/${acces_token}`;
    const expirationTime = "3 hours";

    // Log URL reset password ke terminal
    console.log(`Password reset URL: ${url}`);

    sendPasswordResetEmail(email, url, "Reset Your Password", expirationTime);
    res.status(200).json({ msg: "Password reset email has been sent" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Password does not match" });
    console.log(password);

    if (!validatePassword(password))
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and contain at least one alphabet, one digit, and one special character",
      });

    const paswordHash = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: paswordHash,
      },
      { new: true } // Return the updated document
    );
    await sendPasswordResetConfirmationEmail(user.email);
    res.json({ msg: "Password Success" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "looged out succesfully" });
  } catch (error) {
    console.log("Eror in signUp contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};


export const getMe= async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Eror in signUp contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
}