import { useState, useRef } from "react";

import axios from "axios";

function AudioUI() {

  const [audioFile, setAudioFile] =
    useState(null);

  const [transcription, setTranscription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [recording, setRecording] =
    useState(false);

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  /*
    File Upload
  */
  const handleFileChange = (e) => {

    setAudioFile(e.target.files[0]);
  };

  /*
    Start Recording
  */
  const startRecording = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable =
        (event) => {

          audioChunksRef.current.push(
            event.data
          );
        };

      mediaRecorder.onstop = () => {

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: "audio/wav",
          }
        );

        const file = new File(
          [audioBlob],
          "recording.wav",
          {
            type: "audio/wav",
          }
        );

        setAudioFile(file);
      };

      mediaRecorder.start();

      setRecording(true);

    } catch (error) {

      console.log(error);

      alert("Microphone access denied");
    }
  };

  /*
    Stop Recording
  */
  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);
  };

  /*
    Upload Audio
  */
  const handleUpload = async () => {

    if (!audioFile) {

      alert(
        "Please upload or record audio"
      );

      return;
    }

    const formData = new FormData();

    formData.append(
      "audio",
      audioFile
    );

    try {

      setLoading(true);

      const response =
        await axios.post(

          "http://localhost:5000/api/transcriptions/transcribe",

          formData,

          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(response.data);

      setTranscription(
        response.data.transcription
      );

      alert(
        "Transcription successful"
      );

    } catch (error) {

      console.log(error);

      console.log(
        error.response?.data
      );

      alert(
        "Transcription failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-6">

          Speech To Text App

        </h1>

        {/* File Upload */}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />

        {/* Recording Buttons */}
        <div className="flex gap-3 mb-4">

          {!recording ? (

            <button
              onClick={startRecording}
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Start Recording
            </button>

          ) : (

            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Stop Recording
            </button>
          )}

        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Upload & Transcribe
        </button>

        {/* Loading */}
        {loading && (

          <p className="text-center mt-4 text-blue-500">

            Generating transcription...

          </p>
        )}

        {/* Result */}
        {transcription && (

          <div className="mt-5">

            <h2 className="font-bold mb-2">

              Transcription:

            </h2>

            <div className="bg-gray-200 p-4 rounded">

              {transcription}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AudioUI;