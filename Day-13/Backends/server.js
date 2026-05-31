import express from "express";
import cors from "cors";
import fs from "fs";

import transcriptionRoutes
from "./routes/transcriptionRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

if (!fs.existsSync("uploads")) {

  fs.mkdirSync("uploads");

}

app.get("/", (req, res) => {

  res.send(
    "VoiceNova AI Backend Running Successfully"
  );

});

app.use(
  "/api",
  transcriptionRoutes
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});