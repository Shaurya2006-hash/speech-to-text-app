import Navbar from "../components/Navbar";
import AudioUI from "../components/AudioUI";

function Home() {

  return (

    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">

      <Navbar />

      {/* HERO SECTION */}
      <div className="text-center pt-28 pb-20 px-6">

        <div className="inline-block px-6 py-3 rounded-full border border-cyan-500/20 bg-white/5 text-gray-300 mb-10 backdrop-blur-xl">

          AI Powered Speech-To-Text Platform

        </div>

        <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">

          Convert Voice Into

          <br />

          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

            Smart Text

          </span>

        </h1>

        <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">

          Record live voice, upload audio, and instantly generate accurate AI-powered transcriptions.

        </p>

      </div>

      {/* AUDIO UI */}
      <div className="px-6 pb-24">

        <AudioUI />

      </div>

    </div>

  );
}

export default Home;