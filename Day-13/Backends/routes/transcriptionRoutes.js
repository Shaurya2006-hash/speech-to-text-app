import express from "express";
import multer from "multer";
import fs from "fs";

import {
  transcribeAudio,
  getTranscriptions,
  saveLiveTranscription,
} from "../controllers/transcriptionController.js";

const router = express.Router();

// ==========================================
// CREATE UPLOADS FOLDER IF NOT EXISTS
// ==========================================
const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ==========================================
// MULTER STORAGE CONFIG
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

// ==========================================
// FILE FILTER
// ==========================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/webm",
    "audio/ogg",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only MP3, WAV, WEBM and OGG files are allowed."
      ),
      false
    );
  }
};

// ==========================================
// MULTER CONFIG
// ==========================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// ==========================================
// SAVE LIVE TRANSCRIPTION
// ==========================================
router.post(
  "/save-live",
  saveLiveTranscription
);

// ==========================================
// TRANSCRIBE AUDIO
// ==========================================
router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

// ==========================================
// GET USER HISTORY
// ==========================================
router.get(
  "/transcriptions",
  getTranscriptions
);

export default router;