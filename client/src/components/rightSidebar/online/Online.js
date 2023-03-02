import React, { useEffect, useState } from "react";
import "../index.css";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import io from "socket.io-client";
import ProfilePic from "../../../common/pic/ProfilePic";
import useFetchUsers from "../../../utils/customHooks/UseFetchUsers";

const rightSidebarProfileImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
};

export default function Online({ userId }) {
  const { user: currentUser } = useAuthContext();
  const [online, setOnline] = useState(false);
  const allUsers = useFetchUsers();
  const onlineUser = allUsers.find(
    (u) => u._id === userId && u._id !== currentUser._id
  );

  useEffect(() => {
    const socket = io("http://localhost:5001");

    // When connected to the server, emit the "addUser" event to add the current user to the "users" array on the server-side.
    socket.on("connect", () => {
      socket.emit("addUser", currentUser._id);
    });

    // Listen to the "getUsers" event to update the online status of the user.
    socket.on("getUsers", (users) => {
      const online = users.some((user) => user.userId === onlineUser?._id);
      setOnline(online);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser._id, onlineUser?._id]);

  return (
    <>
      <li className="rightSidebarFriend">
        <div className="rightSidebarProfileImgContainer">
          <ProfilePic style={rightSidebarProfileImg} user={onlineUser} />
          <span
            className={online ? "rightSidebarOnline" : "rightSidebarOffline"}
          ></span>
        </div>
        <div className="rightSidebarUsername">
          {onlineUser?.username}{" "}
          <span style={{ color: "gray" }}>({onlineUser?.pronouns})</span>
        </div>
      </li>
    </>
  );
}
