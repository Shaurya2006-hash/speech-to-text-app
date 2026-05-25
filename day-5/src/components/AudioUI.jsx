import { useRef, useState } from "react";
import axios from "axios";

export default function AudioUI() {

  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Upload File
  const handleFileUpload = (e) => {

    const uploadedFile = e.target.files[0];

    setFile(uploadedFile);

    setAudioURL(URL.createObjectURL(uploadedFile));
  };

  // Start Recording
  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {

      const blob = new Blob(chunksRef.current, {
        type: "audio/wav",
      });

      const recordedFile = new File(
        [blob],
        "recording.wav",
        {
          type: "audio/wav",
        }
      );

      setFile(recordedFile);

      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorder.start();

    setRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);
  };

  // Upload Audio
  const uploadAudio = async () => {

    if (!file) {
      alert("Upload or record audio first");
      return;
    }

    const formData = new FormData();

    formData.append("audio", file);

    try {

      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      setTranscription(response.data.transcription);

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">

        <h1 className="text-2xl font-bold text-center mb-5">
          Speech To Text
        </h1>

        {/* File Upload */}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Buttons */}
        <div className="flex gap-2 mb-4">

          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Record
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Stop
            </button>
          )}

          <button
            onClick={uploadAudio}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Upload
          </button>

        </div>

        {/* Audio Preview */}
        {audioURL && (
          <audio
            controls
            src={audioURL}
            className="w-full mb-4"
          />
        )}

        {/* Transcription */}
        <div className="bg-gray-100 p-3 rounded">

          <h2 className="font-semibold mb-2">
            Transcription
          </h2>

          <p>
            {transcription || "No transcription yet"}
          </p>

        </div>

      </div>

    </div>
  );
}