import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./supabaseClient";

import Home from "./pages/Home";

import Login from "./pages/Login";

import History from "./pages/History";

function App() {

  // =========================
  // SESSION STATE
  // =========================
  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // GET USER SESSION
  // =========================
  useEffect(() => {

    // GET CURRENT SESSION
    supabase.auth
      .getSession()
      .then(({ data }) => {

        setSession(
          data.session
        );

        setLoading(false);

      });

    // LISTEN FOR LOGIN/LOGOUT
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {

          setSession(
            session
          );

        }
      );

    // CLEANUP
    return () => {

      authListener.subscription.unsubscribe();

    };

  }, []);

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">

        Loading...

      </div>

    );

  }

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={
            !session ? (
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            session ? (
              <Home
                session={
                  session
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* HISTORY PAGE */}
        <Route
          path="/history"
          element={
            session ? (
              <History
                session={
                  session
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;