import OpenAI from "openai";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const convertSpeechToText =
  async (filePath) => {

    try {

      const transcription =
        await openai.audio.transcriptions.create({

          file: fs.createReadStream(filePath),

          model: "whisper-1",
        });

      return transcription.text;

    } catch (error) {

      console.log(error);

      throw error;
    }
  };