import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "../client/src/context/AuthProvider";
import Login from "../client/src/components/login/Login";
import Register from "../client/src/components/register/Register";
import Home from "../client/src/components/home/Home";
import Profile from "../client/src/components/profile/Profile";

export default function app() {
  const { user } = useAuthContext();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/" element={<Login />} /> */}
        </Routes>
        {user && (
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}
