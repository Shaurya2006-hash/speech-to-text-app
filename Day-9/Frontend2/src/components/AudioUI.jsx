import { useState, useRef, useEffect } from "react";

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

  const [isLive, setIsLive] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const recognitionRef =
    useRef(null);

  // ==========================================
  // SPEECH RECOGNITION
  // ==========================================
  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      setError(
        "Speech Recognition not supported in this browser."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";

    // LIVE TRANSCRIPTION
    recognition.onresult = (
      event
    ) => {

      let currentText = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {

        currentText +=
          event.results[i][0]
            .transcript + " ";

      }

      setTranscription(
        currentText
      );

    };

    // ERROR HANDLING
    recognition.onerror = (
      event
    ) => {

      console.log(event.error);

      if (
        event.error ===
        "not-allowed"
      ) {

        setError(
          "Microphone permission denied."
        );

      } else if (
        event.error === "network"
      ) {

        setError(
          "Speech recognition network error."
        );

      } else {

        setError(
          "Speech recognition failed."
        );

      }

    };

    // AUTO RESTART
    recognition.onend = () => {

      if (isLive) {

        recognition.start();

      }

    };

    recognitionRef.current =
      recognition;

  }, [isLive]);

  // ==========================================
  // FILE CHANGE
  // ==========================================
  const handleFileChange = (
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        "Invalid file type. Upload MP3, WAV, WEBM or OGG."
      );

      setAudioFile(null);

      return;
    }

    setError("");

    setSuccess(
      "Audio file selected successfully"
    );

    setAudioFile(file);

  };

  // ==========================================
  // START RECORDING
  // ==========================================
  const startRecording =
    async () => {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        const mediaRecorder =
          new MediaRecorder(
            stream
          );

        mediaRecorderRef.current =
          mediaRecorder;

        audioChunksRef.current =
          [];

        mediaRecorder.ondataavailable =
          (event) => {

            audioChunksRef.current.push(
              event.data
            );

          };

        mediaRecorder.onstop =
          () => {

            const audioBlob =
              new Blob(
                audioChunksRef.current,
                {
                  type:
                    "audio/wav",
                }
              );

            const file =
              new File(
                [audioBlob],
                "recording.wav",
                {
                  type:
                    "audio/wav",
                }
              );

            setAudioFile(file);

            setSuccess(
              "Recording completed successfully"
            );

          };

        mediaRecorder.start();

        setRecording(true);

        setError("");

      } catch (error) {

        setError(
          "Microphone access denied."
        );

      }

    };

  // ==========================================
  // STOP RECORDING
  // ==========================================
  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);

  };

  // ==========================================
  // START LIVE TRANSCRIPTION
  // ==========================================
  const startLiveTranscription =
    () => {

      if (
        !recognitionRef.current
      ) {

        setError(
          "Speech recognition not supported."
        );

        return;
      }

      try {

        recognitionRef.current.start();

        setIsLive(true);

        setSuccess(
          "Live transcription started"
        );

        setError("");

      } catch (error) {

        setError(
          "Unable to start live transcription."
        );

      }

    };

  // ==========================================
  // STOP LIVE TRANSCRIPTION
  // ==========================================
  const stopLiveTranscription =
    () => {

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.stop();

        setIsLive(false);

        setSuccess(
          "Live transcription stopped"
        );

      }

    };

  // ==========================================
  // UPLOAD AUDIO
  // ==========================================
  const handleUpload =
    async () => {

      if (!audioFile) {

        setError(
          "Please upload or record audio first."
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioFile
      );

      try {

        setLoading(true);

        setError("");

        setSuccess("");

        const res =
          await axios.post(
            "http://localhost:5000/api/transcribe",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          !res.data.transcription
        ) {

          setError(
            "No transcription returned."
          );

          return;
        }

        setTranscription(
          res.data.transcription
        );

        setSuccess(
          "Transcription completed successfully"
        );

      } catch (error) {

        console.log(error);

        if (
          error.response
        ) {

          setError(
            error.response.data
              .message ||
              "Server error occurred."
          );

        } else {

          setError(
            "Backend server is not running."
          );

        }

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="max-w-5xl mx-auto bg-slate-900/60 border border-cyan-500/20 rounded-[40px] p-10 backdrop-blur-2xl shadow-2xl">

      {/* FILE INPUT */}
      <div className="mb-6">

        <input
          type="file"
          accept="audio/*"
          onChange={
            handleFileChange
          }
          className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white"
        />

      </div>

      {/* RECORD BUTTON */}
      <div className="flex gap-5">

        {!recording ? (

          <button
            onClick={
              startRecording
            }
            className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-white py-4 rounded-2xl w-full font-bold shadow-lg"
          >
            🎙 Start Recording
          </button>

        ) : (

          <button
            onClick={
              stopRecording
            }
            className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white py-4 rounded-2xl w-full font-bold shadow-lg"
          >
            ⏹ Stop Recording
          </button>

        )}

      </div>

      {/* LIVE BUTTONS */}
      <div className="flex gap-5 mt-6">

        <button
          onClick={
            startLiveTranscription
          }
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl w-full font-bold shadow-lg hover:scale-105 transition-all duration-300"
        >
          🎤 Start Live
        </button>

        <button
          onClick={
            stopLiveTranscription
          }
          className="bg-slate-700 hover:bg-slate-800 text-white py-4 rounded-2xl w-full font-bold shadow-lg transition-all duration-300"
        >
          ⏹ Stop Live
        </button>

      </div>

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl w-full mt-6 font-bold shadow-lg hover:scale-105 transition-all duration-300"
      >
        🚀 Upload Audio
      </button>

      {/* ERROR */}
      {error && (

        <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl">

          {error}

        </div>

      )}

      {/* SUCCESS */}
      {success && (

        <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-2xl">

          {success}

        </div>

      )}

      {/* LOADING */}
      {loading && (

        <div className="flex justify-center mt-8">

          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-cyan-500"></div>

        </div>

      )}

      {/* TRANSCRIPTION */}
      <div className="mt-10 bg-slate-800/70 border border-cyan-500/20 p-8 rounded-3xl shadow-xl">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

            Current Transcription

          </h2>

          {isLive && (

            <div className="flex items-center gap-2 text-green-400 font-semibold">

              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

              Live

            </div>

          )}

        </div>

        <p className="text-gray-300 text-lg leading-relaxed min-h-[120px]">

          {transcription ||
            "Start speaking or upload audio..."}

        </p>

      </div>

    </div>

  );
}

export default AudioUI;