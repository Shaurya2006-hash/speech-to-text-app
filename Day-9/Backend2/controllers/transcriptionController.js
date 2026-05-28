import fs from "fs";

import { convertSpeechToText } from "../services/whisperService.js";

import { supabase } from "../config/supabaseClient.js";

// ==========================================
// UPLOAD + TRANSCRIBE AUDIO
// ==========================================
export const transcribeAudio = async (
  req,
  res
) => {

  try {

    // =========================
    // FILE VALIDATION
    // =========================
    if (!req.file) {

      return res.status(400).json({
        success: false,
        message:
          "No audio file uploaded",
      });

    }

    // =========================
    // FILE TYPE VALIDATION
    // =========================
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
    ];

    if (
      !allowedTypes.includes(
        req.file.mimetype
      )
    ) {

      // DELETE INVALID FILE
      fs.unlink(req.file.path, () => {});

      return res.status(400).json({
        success: false,
        message:
          "Invalid audio format. Only MP3, WAV, WEBM and OGG are allowed.",
      });

    }

    // =========================
    // FILE SIZE VALIDATION
    // =========================
    const maxSize =
      10 * 1024 * 1024;

    if (req.file.size > maxSize) {

      fs.unlink(req.file.path, () => {});

      return res.status(400).json({
        success: false,
        message:
          "File size exceeds 10MB limit.",
      });

    }

    const filePath = req.file.path;

    // =========================
    // CONVERT SPEECH TO TEXT
    // =========================
    const transcription =
      await convertSpeechToText(
        filePath
      );

    // =========================
    // EMPTY TRANSCRIPTION CHECK
    // =========================
    if (
      !transcription ||
      transcription.trim() === ""
    ) {

      fs.unlink(filePath, () => {});

      return res.status(400).json({
        success: false,
        message:
          "No speech detected in audio.",
      });

    }

    // =========================
    // SAVE TO SUPABASE
    // =========================
    const { error } = await supabase
      .from("transcriptions")
      .insert([
        {
          file_name:
            req.file.originalname,
          transcription_text:
            transcription,
        },
      ]);

    if (error) {

      console.log(
        "❌ Supabase Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to save transcription",
      });

    }

    // =========================
    // DELETE AUDIO FILE
    // =========================
    fs.unlink(filePath, () => {});

    // =========================
    // SUCCESS RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      message:
        "Transcription completed successfully",
      transcription,
    });

  } catch (error) {

    console.log(
      "❌ Controller Error:",
      error
    );

    // =========================
    // INTERNAL SERVER ERROR
    // =========================
    res.status(500).json({
      success: false,
      message:
        "Internal server error during transcription",
      error: error.message,
    });

  }

};

// ==========================================
// FETCH PREVIOUS TRANSCRIPTIONS
// ==========================================
export const getTranscriptions =
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("transcriptions")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) {

        return res.status(500).json({
          success: false,
          message:
            error.message,
        });

      }

      res.status(200).json({
        success: true,
        transcriptions: data,
      });

    } catch (error) {

      console.log(
        "❌ Fetch Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch transcriptions",
        error: error.message,
      });

    }

  };