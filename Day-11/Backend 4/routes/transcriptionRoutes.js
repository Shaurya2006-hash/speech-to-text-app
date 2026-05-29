import express from "express";
import multer from "multer";

import {
  transcribeAudio,
  getTranscriptions
} from "../controllers/transcriptionController.js";

const router = express.Router();

// =========================
// MULTER CONFIGURATION
// =========================
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  },

});

// =========================
// FILE VALIDATION
// =========================
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/webm",
    "audio/ogg",
  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Invalid file type. Only MP3, WAV, WEBM, and OGG are allowed."
      ),
      false
    );

  }

};

// =========================
// MULTER SETUP
// =========================
const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 10 * 1024 * 1024, // 10MB

  },

});

// =========================
// POST → TRANSCRIBE AUDIO
// =========================
router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

// =========================
// GET → PREVIOUS TRANSCRIPTIONS
// =========================
router.get(
  "/transcriptions",
  getTranscriptions
);

export default router;