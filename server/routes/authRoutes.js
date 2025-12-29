import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js"; // Import the multer config
import User from "../models/User.js";

const router = express.Router();

// --- Auth Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);

// --- Profile Routes ---

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged in user data
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user is already fetched in the 'protect' middleware
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/auth/upload-pic
 * @desc    Upload/Update profile picture
 * @access  Private
 */
router.post("/upload-pic", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid file type" });
    }

    // The file path that will be stored in DB (accessible via http://localhost:5000/uploads/...)
    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: filePath },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture updated successfully",
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
});

export default router;