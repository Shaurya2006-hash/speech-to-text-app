const express = require("express");

const router = express.Router();

const supabase = require("../config/supabaseClient");

// Save transcription
router.post("/save", async (req, res) => {

  try {

    const { file_name, transcription_text } = req.body;

    const { data, error } = await supabase
      .from("transcriptions")
      .insert([
        {
          file_name,
          transcription_text
        }
      ]);

    if (error) {

      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Data saved successfully",
      data,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;