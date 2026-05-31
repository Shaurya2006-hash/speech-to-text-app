import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const convertSpeechToText =
(filePath) => {

  return new Promise(
    (resolve, reject) => {

      console.log(
        "🎤 Received File:",
        filePath
      );

      console.log(
        "🎤 Exists Before Whisper:",
        fs.existsSync(filePath)
      );

      const command =
        `python -m whisper "${filePath}" --model base --output_format txt --output_dir uploads`;

      exec(
        command,
        (
          error,
          stdout,
          stderr
        ) => {

          if (error) {

            console.log(
              "❌ Whisper Error:",
              error
            );

            console.log(
              "❌ STDERR:",
              stderr
            );

            return reject(error);

          }

          console.log(
            "✅ Whisper Output:",
            stdout
          );

          console.log(
            "📝 Whisper Logs:",
            stderr
          );

          const fileName =
            path.parse(
              filePath
            ).name;

          const txtPath =
            path.join(
              "uploads",
              `${fileName}.txt`
            );

          console.log(
            "TXT PATH:",
            txtPath
          );

          if (
            !fs.existsSync(
              txtPath
            )
          ) {

            return reject(
              new Error(
                `Transcription file not found: ${txtPath}`
              )
            );

          }

          fs.readFile(
            txtPath,
            "utf8",
            (
              err,
              textData
            ) => {

              if (err) {

                return reject(err);

              }

              resolve(textData);

            }
          );

        }
      );

    }
  );

};