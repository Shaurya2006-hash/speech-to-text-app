const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");

const transcriptionRoutes = require("./routes/transcriptionRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
  Supabase Routes
*/
app.use("/api/transcriptions", transcriptionRoutes);

/*
  Home Route
*/
app.get("/", (req, res) => {
  res.send("Backend Running");
});

/*
  Upload Route
*/
app.post("/upload", upload.single("audio"), (req, res) => {

  try {

    console.log(req.file);

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });

  } catch (error) {

    res.status(500).json({
      message: "Upload failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});