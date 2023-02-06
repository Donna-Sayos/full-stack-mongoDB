import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";

export default function Friends({ user }) {
  const [FR, setFR] = useState({});

  async function getEnv() {
    const { data } = await Axios.get("/env");
    setFR(data);
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
