const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const transcriptionRoutes = require("./routes/transcriptionRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/*
  Routes
*/
app.use("/api/transcriptions", transcriptionRoutes);

/*
  Home Route
*/
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});