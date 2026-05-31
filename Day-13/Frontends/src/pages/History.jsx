
import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Navbar from "../components/Navbar";

function History({ session }) {

  // ==========================================
  // BACKEND URL
  // ==========================================
  const API_URL =
    "https://speech-to-text-app-y4la.onrender.com";

  const [transcriptions,
    setTranscriptions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH TRANSCRIPTIONS
  // ==========================================
  const fetchData = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          `${API_URL}/api/transcriptions?user_id=${session.user.id}`
        );

      setTranscriptions(
        res.data.transcriptions
      );

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load transcriptions."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (session?.user?.id) {

      fetchData();

    }

  }, [session]);

  return (

    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-6xl font-black text-center mb-14 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

          Previous Transcriptions

        </h1>

        {/* LOADING */}
        {loading && (

          <div className="text-center text-xl text-gray-400">

            Loading...

          </div>

        )}

        {/* ERROR */}
        {error && (

          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-center">

            {error}

          </div>

        )}

        {/* EMPTY */}
        {!loading &&
          transcriptions.length ===
            0 && (

            <div className="bg-slate-900/70 border border-cyan-500/20 rounded-3xl p-10 text-center text-gray-400">

              No Transcriptions Found

            </div>

          )}

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {transcriptions.map(
            (item) => (

              <div
                key={item.id}
                className="bg-slate-900/60 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl"
              >

                <h2 className="text-2xl font-bold text-cyan-400 mb-4">

                  {item.file_name}

                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">

                  {
                    item.transcription_text
                  }

                </p>

                <p className="text-gray-500 text-sm">

                  {new Date(
                    item.created_at
                  ).toLocaleString()}

                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}

export default History;
