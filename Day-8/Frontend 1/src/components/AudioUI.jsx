import { useState, useRef, useEffect } from "react";
import axios from "axios";

function AudioUI() {

  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const [previousTranscriptions, setPreviousTranscriptions] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // FETCH TRANSCRIPTIONS
  const fetchTranscriptions = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/transcriptions"
      );

      setPreviousTranscriptions(res.data.transcriptions);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchTranscriptions();

  }, []);

  // FILE CHANGE
  const handleFileChange = (e) => {

    setAudioFile(e.target.files[0]);

  };

  // START RECORDING
  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {

      audioChunksRef.current.push(event.data);

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
  };

  // STOP RECORDING
  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);

  };

  // UPLOAD AUDIO
  const handleUpload = async () => {

    if (!audioFile) {

      return alert("Upload or record audio");

    }

    const formData = new FormData();

    formData.append("audio", audioFile);

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscription(res.data.transcription);

      fetchTranscriptions();

    } catch (error) {

      console.log(error);

      alert("Transcription failed");

    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">

          <h1 className="text-5xl font-extrabold text-indigo-700 mb-3">
            Speech To Text App
          </h1>

          <p className="text-gray-600 text-lg">
            Upload or record audio and convert it into text instantly.
          </p>

        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">

          {/* FILE INPUT */}
          <div className="mb-5">

            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-xl p-3"
            />

          </div>

          {/* RECORD BUTTONS */}
          <div className="flex gap-4">

            {!recording ? (

              <button
                onClick={startRecording}
                className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-white py-3 rounded-xl w-full font-semibold shadow-lg"
              >
                🎙 Start Recording
              </button>

            ) : (

              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white py-3 rounded-xl w-full font-semibold shadow-lg"
              >
                ⏹ Stop Recording
              </button>

            )}

          </div>

          {/* UPLOAD BUTTON */}
          <button
            onClick={handleUpload}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white py-3 rounded-xl w-full mt-5 font-semibold shadow-lg"
          >
            🚀 Upload Audio
          </button>

          {/* LOADING */}
          {loading && (

            <div className="flex justify-center mt-6">

              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>

            </div>

          )}

          {/* LATEST TRANSCRIPTION */}
          {transcription && (

            <div className="mt-8 bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-md">

              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Latest Transcription
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {transcription}
              </p>

            </div>

          )}

        </div>

        {/* HISTORY SECTION */}
        <div className="mt-12">

          <h2 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
            Previous Transcriptions
          </h2>

          {previousTranscriptions.length === 0 ? (

            <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
              No transcriptions found
            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {previousTranscriptions.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >

                  <h3 className="text-xl font-bold text-indigo-600 mb-3">
                    {item.file_name}
                  </h3>

                  <p className="text-gray-700 mb-4 line-clamp-6">
                    {item.transcription_text}
                  </p>

                  <p className="text-sm text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AudioUI;