import express from "express";
import multer from "multer";

import {
  transcribeAudio,
  getTranscriptions
} from "../controllers/transcriptionController.js";

const router = express.Router();

// Multer Configuration
const upload = multer({
  dest: "uploads/",
});

// POST → Upload and Transcribe Audio
router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

// GET → Fetch Previous Transcriptions
router.get(
  "/transcriptions",
  getTranscriptions
);

export default router;