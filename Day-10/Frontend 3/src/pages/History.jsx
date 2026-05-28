import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";

function History() {

  const [transcriptions, setTranscriptions] =
    useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/transcriptions"
      );

      setTranscriptions(
        res.data.transcriptions
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-6xl font-black text-center mb-14 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

          Previous Transcriptions

        </h1>

        {transcriptions.length === 0 ? (

          <div className="bg-slate-900/70 border border-cyan-500/20 rounded-3xl p-10 text-center text-gray-400">

            No Transcriptions Found

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {transcriptions.map((item) => (

              <div
                key={item.id}
                className="bg-slate-900/60 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition-all duration-300"
              >

                <h2 className="text-2xl font-bold text-cyan-400 mb-4">

                  {item.file_name}

                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed line-clamp-6">

                  {item.transcription_text}

                </p>

                <p className="text-gray-500 text-sm">

                  {new Date(
                    item.created_at
                  ).toLocaleString()}

                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default History;