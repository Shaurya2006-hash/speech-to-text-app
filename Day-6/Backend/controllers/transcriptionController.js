import fs from "fs";

import {
  convertSpeechToText,
} from "../services/whisperService.js";

export const transcribeAudio = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    /*
      Convert Audio To Text
    */
    const transcription =
      await convertSpeechToText(filePath);

    /*
      Delete Uploaded Audio
    */
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
      error: error.message,
    });
  }
};