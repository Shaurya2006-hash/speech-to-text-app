import express from "express";
import multer from "multer";

import {
  transcribeAudio,
} from "../controllers/transcriptionController.js";

const router = express.Router();

/*
  Multer Storage Setup
*/
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

/*
  Upload Object
*/
const upload = multer({
  storage: storage,
});

/*
  Transcribe Route
*/
router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

export default router;