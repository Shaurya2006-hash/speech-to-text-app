import { useState, useRef, useEffect } from "react";
import axios from "axios";

function AudioUI() {

  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  // NEW STATE
  const [previousTranscriptions, setPreviousTranscriptions] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // FETCH OLD TRANSCRIPTIONS
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

  // LOAD WHEN PAGE OPENS
  useEffect(() => {

    fetchTranscriptions();

  }, []);

  const handleFileChange = (e) => {

    setAudioFile(e.target.files[0]);

  };

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

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });

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

  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);

  };

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

      // REFRESH HISTORY
      fetchTranscriptions();

    } catch (error) {

      console.log(error);

      alert("Transcription failed");

    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto">

        {/* Upload Card */}
        <div className="bg-white p-6 rounded shadow-md">

          <h1 className="text-3xl font-bold mb-4">
            Speech To Text
          </h1>

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />

          <div className="flex gap-2 mt-3">

            {!recording ? (

              <button
                onClick={startRecording}
                className="bg-green-500 text-white p-2 w-full rounded"
              >
                Start Recording
              </button>

            ) : (

              <button
                onClick={stopRecording}
                className="bg-red-500 text-white p-2 w-full rounded"
              >
                Stop Recording
              </button>

            )}

          </div>

          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white p-2 w-full mt-3 rounded"
          >
            Upload Audio
          </button>

          {loading && (
            <p className="mt-3 text-blue-500">
              Processing...
            </p>
          )}

          {transcription && (

            <div className="mt-4 bg-gray-100 p-3 rounded">

              <h2 className="font-bold mb-2">
                Latest Result
              </h2>

              <p>{transcription}</p>

            </div>

          )}

        </div>

        {/* Previous Transcriptions */}
        <div className="mt-6">

          <h2 className="text-2xl font-bold mb-4">
            Previous Transcriptions
          </h2>

          {
            previousTranscriptions.length === 0 ? (

              <p>No transcriptions found</p>

            ) : (

              previousTranscriptions.map((item) => (

                <div
                  key={item.id}
                  className="bg-white p-4 rounded shadow mb-4"
                >

                  <h3 className="font-bold text-lg">
                    {item.file_name}
                  </h3>

                  <p className="mt-2">
                    {item.transcription_text}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(item.created_at).toLocaleString()}
                  </p>

                </div>

              ))

            )
          }

        </div>

      </div>

    </div>
  );
}

export default AudioUI;