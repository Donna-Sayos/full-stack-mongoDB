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
  otherUser,
}) {
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const { notifications, clearUserNotif } = useOnlineContext(); // TODO: remove if not needed
  const userNotifCount = notifications[currentUser._id]?.userNotifications; // FIXME: need to fix this

  // Check if the current user is the friend
  const isFriend =
    currentUser._id !== conversation.members[0]
      ? conversation.members[0]
      : conversation.members[1];

  const fetchCount = useCallback(async () => {
    try {
      if (conversation) {
        const { data } = await Axios.get(
          `/api/v1/conversations/${conversation._id}/notification`
        );
        setNotificationCount(data.notificationCount);
      }
    } catch (err) {
      console.log(`Error fetching notification count: ${err}`);
    }
  }, [conversation]);

  const handleConvo = async () => {
    try {
      await clearUserNotif(currentUser._id);
      await resetConvoNotification(conversation._id);

      setNotificationCount(0);
    } catch (err) {
      console.log(`Error conversation click handler: ${err}`);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await Axios(`/api/v1/users/${isFriend}`);
        setUser(data);
      } catch (err) {
        console.log(`Error fetching user: ${err}`);
      }
    };

    getUser();
  }, [isFriend]);

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
          className={`conversationName ${
            notificationCount && userNotifCount ? "fw-bold" : ""
          }`}
        >
          {user?.username}
        </span>
      </div>
      {userNotifCount > 0 && notificationCount > 0 && (
        <span className="badge bg-primary">{notificationCount}</span>
      )}
    </div>
  );
}
