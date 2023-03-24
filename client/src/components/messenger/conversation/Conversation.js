import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";
import { useOnlineContext } from "../../../context/online/OnlineContextProvider";
import { resetConvoNotification } from "../../../utils/helper/helperFunctions";

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
  const { activateInChat } = useOnlineContext();

  const handleConvo = async () => {
    try {
      await resetConvoNotification(conversation._id);
      setNotificationCount(0);

      activateInChat();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const { data } = await Axios(`/api/v1/users/${friendId}`);
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [currentUser, conversation]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (conversation) {
          const { data } = await Axios.get(
            `/api/v1/conversations/${conversation?._id}/notification`
          );
          setNotificationCount(data.notificationCount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCount();
  }, [conversation]);

  return (
    <div
      className="conversation d-flex justify-content-between"
      onClick={handleConvo}
    >
      <div>
        <ProfilePic user={user} style={conversationImg} />
        <span
          className={`conversationName ${notificationCount ? "fw-bold" : ""}`}
        >
          {user?.username}
        </span>
      </div>
      {notificationCount > 0 && (
        <span className="badge bg-primary">{notificationCount}</span>
      )}
    </div>
  );
}
