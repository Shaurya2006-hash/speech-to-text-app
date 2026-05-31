import { Link } from "react-router-dom";

function Navbar() {

  return (

    <div className="w-full border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/">

          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            VoiceNova AI
          </h1>

        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-8 text-lg font-semibold">

          <Link
            to="/"
            className="text-white hover:text-cyan-400 transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/history"
            className="text-white hover:text-cyan-400 transition duration-300"
          >
            History
          </Link>

          <Link
            to="/login"
            className="text-white hover:text-cyan-400 transition duration-300"
          >
            Login
          </Link>

          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg">

            Get Started

          </button>

        </div>

      </div>

    </div>

  );
}

export default Navbar;