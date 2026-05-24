const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  transcribeAudio,
} = require("../controller/transcriptionController");

/*
  Multer Storage Setup
*/
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

/*
  Upload Object
*/
const upload = multer({
  storage: storage,
});

/*
  Transcribe Audio Route
*/
router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

module.exports = router;