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

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const { notifications, clearCount, clearUserNotif } = useOnlineContext();
  const [count, setCount] = useState(0);

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

  const handleNotificationsClick = () => {
    clearCount(user?._id);
    clearUserNotif();
  };

  console.log("count", count);

  return (
    <div
      className="conversation d-flex justify-content-between"
      onClick={handleNotificationsClick}
    >
      <div>
        <ProfilePic user={user} style={conversationImg} />
        <span className={`conversationName ${count ? "fw-bold" : ""}`}>
          {user?.username}
        </span>
      </div>
      {count > 0 && <span className="badge bg-primary">{count}</span>}
    </div>
  );
}
