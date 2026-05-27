import fs from "fs";
import { convertSpeechToText } from "../services/whisperService.js";
import { supabase } from "../config/supabaseClient.js";

// Upload + Transcribe Audio
export const transcribeAudio = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });

    }

    const filePath = req.file.path;

    // Convert speech to text
    const transcription = await convertSpeechToText(filePath);

    // Delete uploaded audio file after transcription
    fs.unlink(filePath, () => {});

    res.status(200).json({
      success: true,
      transcription: transcription,
    });

  } catch (error) {

    console.log("❌ Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Transcription failed",
      error: error.message,
    });

  }
};

// Fetch Previous Transcriptions
export const getTranscriptions = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("transcriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

    res.status(200).json({
      success: true,
      transcriptions: data,
    });

  } catch (error) {

    console.log("❌ Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transcriptions",
      error: error.message,
    });

  }
};