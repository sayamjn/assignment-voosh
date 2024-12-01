require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://assignment-voosh.onrender.com",
      "https://127.0.0.1:5173",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

require("./config/passport");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"))
);

module.exports = app;
