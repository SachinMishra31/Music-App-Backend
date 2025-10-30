import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// Importing routes
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import jamendoRoutes from "./routes/jamendoRoutes.js";
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

// Static files (optional)
const publicPath = path.join(path.resolve(), "public");
app.use(express.static(publicPath));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", userJwtMiddleware, songRoutes);
app.use("/api/v1/playlist", userJwtMiddleware, playlistRoutes);
app.use("/api/v1/jamendo", jamendoRoutes);

// Controllers
app.get("/api/v1/stream/:filename", streamSong);
app.get("/api/v1/songs", getSongs);

// Root test route
app.get("/", (req, res) => {
  res.send("🎵 Music Stream Backend Running Successfully on Vercel!");
});

// ✅ Export the app (IMPORTANT for Vercel)
export default app;
