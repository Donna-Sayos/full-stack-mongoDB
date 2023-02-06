import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import Friends from "../friends/Friends";
import {
  MdRssFeed,
  MdOutlineChat,
  MdPlayCircleOutline,
  MdGroups,
  MdOutlineBookmark,
  MdOutlineLiveHelp,
  MdOutlineWorkOutline,
  MdSchool,
  MdEvent,
} from "react-icons/md";

export default function Sidebar() {
  const [users, setUsers] = useState([]);

  async function getUsers() {
    const { data } = await Axios.get("/api/v1/users");
    setUsers(data);
  }

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      {users.map((user) => (
        <div key={user.userId}>
          <h3>
            {user.firstName} {user.LastName}
          </h3>
        </div>
      ))}
    </div>
  );
}
