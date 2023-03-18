import React, { useEffect, useState } from "react";
import "../index.css";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import io from "socket.io-client";
import ProfilePic from "../../../common/pic/ProfilePic";
import useFetchUsers from "../../../utils/customHooks/UseFetchUsers";
import { useOnlineContext } from "../../../context/online/OnlineContextProvider";

const rightSidebarProfileImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
};

export default function Online({ userId }) {
  const { user: currentUser } = useAuthContext();
  const { onlineUsers } = useOnlineContext();
  const allUsers = useFetchUsers();
  const following = allUsers.find(
    (u) => u._id === userId && u._id !== currentUser._id
  );
  const isOnline = onlineUsers.includes(following?._id);

  return (
    <>
      {isOnline && (
        <li className="rightSidebarFriend">
          <div className="rightSidebarProfileImgContainer">
            <ProfilePic style={rightSidebarProfileImg} user={following} />
            <span
              // TODO: Clean up this code
              // className={isOnline ? "rightSidebarOnline" : "rightSidebarOffline"}
              className="rightSidebarOnline"
            ></span>
          </div>
          <div className="rightSidebarUsername">
            {following?.username}
            <span style={{ color: "gray" }}>({following?.pronouns})</span>
          </div>
        </li>
      )}
    </>
  );
}
