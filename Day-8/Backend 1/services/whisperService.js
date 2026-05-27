import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { supabase } from "../config/supabaseClient.js";

export const convertSpeechToText = (filePath) => {
  return new Promise((resolve, reject) => {

    const command = `python -m whisper "${filePath}" --model base --output_format txt --output_dir uploads`;

    exec(command, (error, stdout, stderr) => {

      if (error) {
        console.log("❌ Whisper Error:", error);
        return reject(error);
      }

      console.log("Whisper Output:", stdout);
      console.log("Whisper Logs:", stderr);

      const fileName = path.parse(filePath).name;
      const txtPath = path.join("uploads", `${fileName}.txt`);

      if (!fs.existsSync(txtPath)) {
        return reject(new Error(`Transcription file not found: ${txtPath}`));
      }

      fs.readFile(txtPath, "utf8", async (err, textData) => {

        if (err) {
          return reject(err);
        }

        try {

          console.log("👉 Saving to Supabase...");

          const { data, error } = await supabase
            .from("transcriptions")
            .insert([
              {
                file_name: fileName,
                transcription_text: textData
              }
            ])
            .select();

          if (error) {
            console.log("❌ Supabase Error:", error);
            return reject(error);
          }

          console.log("✅ Successfully inserted:", data);

          resolve(textData);

        } catch (dbError) {

          console.log("❌ DB Exception:", dbError);
          reject(dbError);

        }
      });
    });
  });
};