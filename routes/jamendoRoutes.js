import express from "express";
import axios from "axios";

const router = express.Router();
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=24&namesearch=${encodeURIComponent(query)}&tag=${encodeURIComponent(query)}&audioformat=mp31`;
    const { data } = await axios.get(url);

    const tracks = (data.results || []).map((t) => ({
      id: t.id,
      name: t.name,
      artist_name: t.artist_name,
      album_image: t.album_image,
      audio: t.audio,
      license: t.license,
      duration: t.duration,
    }));

    res.json(tracks);
  } catch (error) {
    console.error("Jamendo search failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch songs from Jamendo",
      details: error.message,
    });
  }
});

export default router;
