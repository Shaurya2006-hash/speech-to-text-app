import express from "express";
import cors from "cors";
import transcriptionRoutes from "./routes/transcriptionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// ROOT ROUTE
// ==========================================
app.get("/", (req, res) => {

  res.send(
    "VoiceNova AI Backend Running Successfully"
  );

});

// ==========================================
// API ROUTES
// ==========================================
app.use("/api", transcriptionRoutes);

// ==========================================
// PORT
// ==========================================
const PORT =
  process.env.PORT || 5000;

// ==========================================
// SERVER START
// ==========================================
app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});