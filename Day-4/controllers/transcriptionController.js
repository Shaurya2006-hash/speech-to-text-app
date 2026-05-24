import fs from "fs";
import { convertSpeechToText } from "../services/whisperService.js";

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // Convert audio to text
    const transcription = await convertSpeechToText(filePath);

    // Delete uploaded audio after processing
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      transcription,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Transcription failed",
    });
  }
};