// controllers/auth.controller.js  (adjust filename/path if needed)
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import connectDB from "../utils/db.js"; // <-- ensure correct path

const SECRET = process.env.SECRET_KEY;
if (!SECRET) {
  console.error("SECRET_KEY not set in env!");
}

// helper to decide cookie options for prod vs dev
const cookieOptions = () => {
  if (process.env.NODE_ENV === "production") {
    return {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // required for cross-site cookies
      secure: true, // required for sameSite: 'none'
    };
  }
  // local/dev
  return {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  };
};

export const register = async (req, res) => {
  try {
    await connectDB();
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, SECRET, { expiresIn: "1d" });

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      verified: false,
      verificationToken,
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    const emailHtml = `
      <h1>Verify Your Email</h1>
      <p>Hi ${fullName},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    // Send verification email (await so errors surface)
    await sendEmail(email, "Email Verification", emailHtml);

    return res.status(201).json({
      message: "Account created. Please verify your email",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Error creating account",
      success: false,
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    await connectDB();
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is missing", success: false });
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified. Please Login",
        success: false,
      });
    }
    if (user.verificationToken !== token) {
      return res
        .status(400)
        .json({ message: "Invalid verification token", success: false });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
      user: {
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(400).json({
      message: error.message || "Invalid or expired verification token",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN START", new Date().toISOString());
    await connectDB();
    console.log("STEP: DB ready");

    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }
    if (!user.verified) {
      return res.status(400).json({
        message: "Please verify your email first",
        success: false,
        isVerificationError: true,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, SECRET, { expiresIn: "15d" });

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    console.log("LOGIN RESPONSE READY");
    return res
      .status(200)
      .cookie("token", token, cookieOptions())
      .json({
        message: `Welcome back ${user.fullName}`,
        user: safeUser,
        success: true,
      });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error during login",
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out Successfully", success: true });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({
      message: "Server error during logout",
      success: false,
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    await connectDB();
    console.log("Received request body:", req.body);

    const { fullName, email, phoneNumber, bio, skills, resume } = req.body;
    const userId = req.id; // ensure your auth middleware sets req.id

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.v2.uploader.upload(
        fileUri.content
      );
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    } else if (resume) {
      user.profile.resume = resume;
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",").map((s) => s.trim());

    await user.save();
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user, success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email }, SECRET, { expiresIn: "15m" });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailHtml = `
      <h1>Reset Your Password</h1>
      <p>Hi ${user.fullName},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(email, "Password Reset", emailHtml);

    return res.status(200).json({
      message: "Password reset email sent",
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Error sending reset email",
      success: false,
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    await connectDB();
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
        success: false,
      });
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findOne({
      email: decoded.email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(400).json({
      message: error.message || "Invalid reset token",
      success: false,
    });
  }
};
