const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validate = require("../middleware/validate");
const { OAuth2Client } = require("google-auth-library");
const auth = require('../middleware/auth');

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/signup", async (req, res, next) => {
  try {
    console.log("Received signup request body:", {
      ...req.body,
      password: "[REDACTED]",
    });

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    console.log("Creating new user...");
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    console.log("User created successfully:", {
      id: user._id,
      email: user.email,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Error in signup:", {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const {
      sub: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture: avatar,
    } = ticket.getPayload();

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        email,
        firstName,
        lastName,
        avatar,
      });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/profile", auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const updates = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder: "avatars",
            width: 250,
            height: 250,
            crop: "fill",
          }
        );
        updates.avatar = result.secure_url;
      }

      const allowedUpdates = ["firstName", "lastName", "bio", "avatar"];
      allowedUpdates.forEach((update) => {
        if (updates[update] !== undefined) {
          user[update] = updates[update];
        }
      });

      await user.save();
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
