import {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";

function AudioUI({ session }) {

  const API_URL =
    "https://speech-to-text-app-y4la.onrender.com";

  // ==========================================
  // STATES
  // ==========================================
  const [audioFile, setAudioFile] =
    useState(null);

  const [transcription, setTranscription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [isLive, setIsLive] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // REFS
  // ==========================================
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
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult =
      (event) => {

        let liveText = "";

        for (
          let i = 0;
          i < event.results.length;
          i++
        ) {

          liveText +=
            event.results[i][0]
              .transcript + " ";
        }

        setTranscription(
          liveText
        );
      };

    recognition.onerror =
      (event) => {

        console.log(
          "Speech Error:",
          event.error
        );

        if (
          event.error === "aborted"
        ) {
          return;
        }

        if (
          event.error ===
          "not-allowed"
        ) {

          setError(
            "Microphone permission denied."
          );

        } else {

          setError(
            "Speech recognition failed."
          );
        }
      };

    recognition.onend = () => {

      if (isLive) {

        try {

          recognition.start();

        } catch (error) {

          console.log(error);

        }
      }
    };

    recognitionRef.current =
      recognition;

  }, [isLive]);

  // ==========================================
  // FILE CHANGE
  // ==========================================
  const handleFileChange =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      setAudioFile(file);

      setSuccess(
        "Audio selected successfully"
      );

      setError("");
    };

  // ==========================================
  // SAVE LIVE TRANSCRIPTION
  // ==========================================
  const saveLiveTranscription =
    async () => {

      try {

        await axios.post(
          `${API_URL}/api/save-live`,
          {
            user_id:
              session.user.id,

            transcription_text:
              transcription,
          }
        );

      } catch (error) {

        console.log(
          "Save Live Error:",
          error
        );
      }
    };

  // ==========================================
  // START LIVE
  // ==========================================
  const startLiveTranscription =
    () => {

      setError("");
      setSuccess("");

      try {

        recognitionRef.current.start();

        setIsLive(true);

        setTranscription("");

        setSuccess(
          "Live transcription started"
        );

      } catch (error) {

        console.log(error);

      }
    };

  // ==========================================
  // STOP LIVE
  // ==========================================
  const stopLiveTranscription =
    async () => {

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.stop();
      }

      setIsLive(false);

      if (
        transcription.trim()
      ) {

        await saveLiveTranscription();
      }

      setSuccess(
        "Live transcription saved successfully"
      );
    };

  // ==========================================
  // AUDIO UPLOAD
  // ==========================================
  const handleUpload =
    async () => {

      if (!audioFile) {

        setError(
          "Please select an audio file."
        );

        return;
      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "audio",
          audioFile
        );

        formData.append(
          "user_id",
          session.user.id
        );

        const res =
          await axios.post(
            `${API_URL}/api/transcribe`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setTranscription(
          res.data.transcription
        );

        setSuccess(
          "Transcription completed successfully"
        );

      } catch (error) {

        console.log(error);

        setError(
          error?.response?.data
            ?.message ||
            "Server Error"
        );

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

      {/* LIVE BUTTONS */}
      <div className="flex gap-5">

        <button
          onClick={
            startLiveTranscription
          }
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl w-full font-bold"
        >
          🎤 Start Live
        </button>

        <button
          onClick={
            stopLiveTranscription
          }
          className="bg-slate-700 text-white py-4 rounded-2xl w-full font-bold"
        >
          ⏹ Stop Live
        </button>

      </div>

      {/* UPLOAD */}
      <button
        onClick={handleUpload}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl w-full mt-6 font-bold"
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
      <div className="mt-10 bg-slate-800/70 border border-cyan-500/20 p-8 rounded-3xl">

        <h2 className="text-3xl font-black text-cyan-400 mb-5">

          Current Transcription

        </h2>

        <p className="text-gray-300 text-lg">

          {transcription ||
            "Start speaking or upload audio..."}

        </p>

      </div>

    </div>

  );
}

export default AudioUI;