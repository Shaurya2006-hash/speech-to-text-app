import { useState } from "react";
import Navbar from "../components/Navbar";

function Login() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = () => {

    if (name.length < 3) {

      return alert(
        "Name should be at least 3 characters"
      );

    }

    if (!email.endsWith("@gmail.com")) {

      return alert(
        "Email must end with @gmail.com"
      );

    }

    if (password.length < 6) {

      return alert(
        "Password should be at least 6 characters"
      );

    }

    alert("Login Successful");

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">

      <Navbar />

      <div className="flex items-center justify-center px-6 py-24">

        <div className="w-full max-w-md bg-slate-900/70 border border-cyan-500/20 rounded-[40px] p-10 backdrop-blur-2xl shadow-2xl">

          <h1 className="text-5xl font-black text-center mb-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

            Login

          </h1>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white outline-none"
            />

            <input
              type="email"
              placeholder="Enter Gmail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white outline-none"
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white outline-none"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
            >

              Login

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;