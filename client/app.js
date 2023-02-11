import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "../client/src/context/auth/AuthProvider";
import Login from "../client/src/components/auth/login/Login";
import Register from "../client/src/components/auth/register/Register";
import Home from "../client/src/components/home/Home";
import Profile from "../client/src/components/profile/Profile";

export default function app() {
  const [isdisabled, setIsdisabled] = useState(true);
  const recaptchaRef = useRef(null);

  const { user } = useAuthContext();

  const handleRecaptcha = (value) => {
    console.log("RECAPTCHA", value);
    setIsdisabled(false);
  };

  const resetRecaptcha = () => {
    recaptchaRef.current.reset();
    console.log("recaptcha reset");
    setIsdisabled(true);
  };

  return (
    <>
      <BrowserRouter>
        {!user && (
          <Routes>
            <Route
              path="/signup"
              element={<Register resetRecaptcha={resetRecaptcha} />}
            />
            <Route
              path="/"
              element={
                <Login
                  handleRecaptcha={handleRecaptcha}
                  resetRecaptcha={resetRecaptcha}
                  isdisabled={isdisabled}
                  recaptchaRef={recaptchaRef}
                />
              }
            />
          </Routes>
        )}
        {user && (
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}
