import express from "express";
import cors from "cors";
import transcriptionRoutes from "./routes/transcriptionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", transcriptionRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});