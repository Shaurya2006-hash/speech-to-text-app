import fs from "fs";

import { convertSpeechToText }
from "../services/whisperService.js";

import { supabase }
from "../config/supabaseClient.js";

export const transcribeAudio =
async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message:
          "No audio file uploaded",
      });

    }

    const { user_id } =
      req.body;

    if (!user_id) {

      return res.status(401).json({
        success: false,
        message:
          "User not found",
      });

    }

    const filePath =
      req.file.path;

    const transcription =
      await convertSpeechToText(
        filePath
      );

    const { data, error } =
      await supabase
        .from("transcriptions")
        .insert([
          {
            user_id,
            file_name:
              req.file.originalname,
            transcription_text:
              transcription,
          },
        ])
        .select();

    if (error) {

      console.log(
        "Supabase Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to save transcription",
      });

    }

    fs.unlink(
      filePath,
      () => {}
    );

    res.status(200).json({
      success: true,
      transcription,
      savedData: data,
    });

  } catch (error) {

    console.log(
      "Controller Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

export const getTranscriptions =
async (req, res) => {

  try {

    const { user_id } =
      req.query;

    const {
      data,
      error
    } = await supabase
      .from("transcriptions")
      .select("*")
      .eq(
        "user_id",
        user_id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

    res.status(200).json({
      success: true,
      transcriptions:
        data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};