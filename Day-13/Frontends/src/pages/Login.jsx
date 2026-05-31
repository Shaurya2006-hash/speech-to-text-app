import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { supabase } from "../supabaseClient";

function Login() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // CHECK IF ALREADY LOGGED IN
  // =========================
  useEffect(() => {

    const checkUser = async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (session) {

        navigate("/");

      }

    };

    checkUser();

  }, []);

  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin = async () => {

    setError("");

    setSuccess("");

    // =========================
    // NAME VALIDATION
    // =========================
    if (
      name.trim().length < 3
    ) {

      return setError(
        "Name should be at least 3 characters"
      );

    }

    // =========================
    // EMAIL VALIDATION
    // =========================
    if (
      !email.endsWith(
        "@gmail.com"
      )
    ) {

      return setError(
        "Email must end with @gmail.com"
      );

    }

    // =========================
    // PASSWORD VALIDATION
    // =========================
    if (
      password.length < 6
    ) {

      return setError(
        "Password should be at least 6 characters"
      );

    }

    try {

      setLoading(true);

      // =========================
      // LOGIN EXISTING USER
      // =========================
      const {
        data: loginData,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password,
          }
        );

      // =========================
      // IF LOGIN FAILS → CREATE ACCOUNT
      // =========================
      if (loginError) {

        const {
          data: signupData,
          error: signupError,
        } =
          await supabase.auth.signUp(
            {
              email,
              password,
            }
          );

        if (signupError) {

          return setError(
            signupError.message
          );

        }

        setSuccess(
          "Signup successful"
        );

      } else {

        setSuccess(
          "Login successful"
        );

      }

      // SAVE USER NAME
      localStorage.setItem(
        "username",
        name
      );

      // REDIRECT
      setTimeout(() => {

        navigate("/");

      }, 1000);

    } catch (error) {

      console.log(error);

      setError(
        "Authentication failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">

        <div className="w-full max-w-md bg-slate-900 border border-cyan-500/20 rounded-[40px] p-10 shadow-2xl">

          {/* HEADING */}
          <h1 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

            VoiceNova AI

          </h1>

          <p className="text-center text-gray-400 mb-10">

            AI Powered Speech Recognition

          </p>

          {/* ERROR */}
          {error && (

            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-5">

              {error}

            </div>

          )}

          {/* SUCCESS */}
          {success && (

            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl mb-5">

              {success}

            </div>

          )}

          {/* FORM */}
          <div className="space-y-5">

            {/* NAME */}
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              autoComplete="off"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white placeholder-gray-500 outline-none focus:border-cyan-500"
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Enter Gmail"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              autoComplete="off"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white placeholder-gray-500 outline-none focus:border-cyan-500"
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              autoComplete="off"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white placeholder-gray-500 outline-none focus:border-cyan-500"
            />

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
            >

              {loading
                ? "Please wait..."
                : "Login / Signup"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;