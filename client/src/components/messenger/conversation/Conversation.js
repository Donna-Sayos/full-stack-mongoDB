import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";
import { useOnlineContext } from "../../../context/online/OnlineContextProvider";

const conversationImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "20px",
};

export default function Conversation({
  conversation,
  currentUser,
  notificationCount,
  setNotificationCount,
}) {
  const [user, setUser] = useState(null);

  handleClearConvo = () => {
    setNotificationCount(0);
  };

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await Axios(`/api/v1/users/${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [currentUser, conversation]);

  console.log("notificationCount: ", notificationCount);

  return (
    <div
      className="conversation d-flex justify-content-between"
      onClick={handleClearConvo}
    >
      <div>
        <ProfilePic user={user} style={conversationImg} />
        <span
          className="conversationName"
          // className={`conversationName ${converSationNotif ? "fw-bold" : ""}`}
        >
          {user?.username}
        </span>
      </div>
      {/* {converSationNotif > 0 && (
        <span className="badge bg-primary">{converSationNotif}</span>
      )} */}
    </div>
  );
}
