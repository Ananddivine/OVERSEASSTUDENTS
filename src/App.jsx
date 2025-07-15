import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/admin/Admin";
import Login from "./Components/Login/Login";
import ForgotPassword from "./Components/Login/ForgotPassword";
import Footer from "./Components/Footer/Footer";
import "./index.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const PING_INTERVAL = 1 * 60 * 1000;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const location = useLocation();

  useEffect(() => {
    const storedExpirationTime = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();
    if (storedExpirationTime && currentTime > storedExpirationTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("tokenExpiration");
      setToken("");
    }
  }, []);




  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    const sendPing = () => {
      fetch(`${backendUrl}/keep-alive`).then((res) => res.json());
    };

    sendPing();
    const interval = setInterval(sendPing, PING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const hideNavbarRoutes = ["/ForgotPassword", "/login"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {!shouldHideNavbar && (
          <Navbar setToken={setToken} />
        )}

        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />

          {/* Protected route */}
          <Route
            path="/*"
            element={
              token ? (
                <Admin  />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
