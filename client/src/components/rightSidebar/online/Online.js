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
  const onlineUser = allUsers.find(
    (u) => u._id === userId && u._id !== currentUser._id
  );
  const isOnline = onlineUsers.includes(onlineUser?._id);

  return (
    <>
      <li className="rightSidebarFriend">
        <div className="rightSidebarProfileImgContainer">
          <ProfilePic style={rightSidebarProfileImg} user={onlineUser} />
          <span
            className={isOnline ? "rightSidebarOnline" : "rightSidebarOffline"}
          ></span>
        </div>
        <div className="rightSidebarUsername">
          {onlineUser?.username}
          <span style={{ color: "gray" }}>({onlineUser?.pronouns})</span>
        </div>
      </li>
    </>
  );
}
