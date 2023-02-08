import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";

export default function Online({ user }) {
  const [otherUsers, setOtherUsers] = useState([]);
  const { user: currentUser } = useAuthContext();

  const onlineUser = otherUsers.filter((u) => u._id === user)[0];

  async function getUsers() {
    const { data } = await Axios.get("/api/v1/users");
    setOtherUsers(data.filter((u) => u._id !== currentUser._id));
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {onlineUser ? (
        <li className="rightSidebarFriend">
          <div className="rightSidebarProfileImgContainer">
            <img
              className="rightSidebarProfileImg"
              src={
                onlineUser.profilePicture
                  ? "/images/" + onlineUser.profilePicture
                  : "/images/" + "avatar/default-user-photo.png"
              }
              alt="user"
            />
            <span className="rightSidebarOnline"></span>
          </div>
          <div className="rightSidebarUsername">
            {onlineUser.username}{" "}
            <span style={{ color: "gray" }}>({onlineUser.pronouns})</span>
          </div>
        </li>
      ) : (
        <p style={{ color: "gray" }}>No online users</p>
      )}
    </>
  );
}
