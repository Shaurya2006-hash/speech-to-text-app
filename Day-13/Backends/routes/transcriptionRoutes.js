import express from "express";
import multer from "multer";
import fs from "fs";

import {
  transcribeAudio,
  getTranscriptions
} from "../controllers/transcriptionController.js";

const router = express.Router();

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    const uploadPath = "uploads";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, {
        recursive: true,
      });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  },

});

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
        "Only MP3, WAV, WEBM and OGG files are allowed."
      ),
      false
    );

  }

};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

router.get(
  "/transcriptions",
  getTranscriptions
);

export default router;