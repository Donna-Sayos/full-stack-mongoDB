import React, { useEffect, useState, useCallback } from "react";
import "./index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";
import { useOnlineContext } from "../../../context/online/OnlineContextProvider"; // TODO: remove if not needed
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
  friendId,
  setFriendId,
}) {
  const [user, setUser] = useState(null);
  const { setUserNotif } = useOnlineContext(); // TODO: remove if not needed

  const handleConvo = async () => {
    try {
      await resetConvoNotification(conversation._id, user?._id);
      setNotificationCount(0);
    } catch (err) {
      console.log(`Error conversation click handler: ${err}`);
    }
  };

  const fetchCount = useCallback(async () => {
    try {
      if (conversation && friendId) {
        const { data } = await Axios.get(
          `/api/v1/conversations/${conversation?._id}/notification/${friendId}`
        );
        console.log(`Notification count (GET): ${data.notificationCount}`);
        setNotificationCount(data.notificationCount);
      }
    } catch (err) {
      console.log(err);
    }
  }, [conversation, friendId, setNotificationCount]);

  useEffect(() => {
    const friend = conversation.members.find((m) => m !== currentUser._id);
    setFriendId(friend);

    const getUser = async () => {
      try {
        const { data } = await Axios(`/api/v1/users/${friend}`);
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [currentUser, conversation]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

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
