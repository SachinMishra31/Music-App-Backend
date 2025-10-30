import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// Importing routes
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import jamendoRoutes from "./routes/jamendoRoutes.js"; // ✅ Jamendo route
import { getSongs, streamSong } from "./controllers/songController.js";
import { userJwtMiddleware } from "./middlewares/authMiddleware.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Serve static files safely (optional)
const publicPath = path.join(path.resolve(), "public");
app.use(express.static(publicPath));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", userJwtMiddleware, songRoutes);
app.use("/api/v1/playlist", userJwtMiddleware, playlistRoutes);
app.use("/api/v1/jamendo", jamendoRoutes); // ✅ Jamendo API route

// Controllers
app.get("/api/v1/stream/:filename", streamSong);
app.get("/api/v1/songs", getSongs);

// Optional fallback (only if frontend is inside backend/public)
// Commented out to avoid ENOENT errors if index.html doesn’t exist
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve("public/index.html"));
// });

// Start server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
