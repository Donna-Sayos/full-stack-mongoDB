import React, { useState, useEffect } from "react";
import "./index.css";

export default function Friends({ user }) {
  const [FR, setFR] = useState({});

  async function getEnv() {
    const response = await fetch("http://localhost:5001/env");
    const env = await response.json();
    setFR(env);
  }

  useEffect(() => {
    getEnv();
  }, []);
  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={
          user.profilePicture
            ? FR.FILES_ROUTE + user.profilePicture
            : FR.FILES_ROUTE + "user/default-user-photo.png"
        }
        alt="friend"
      />
      <span className="sidebarFriendName">{user.firstName}</span>
    </li>
  );
}
