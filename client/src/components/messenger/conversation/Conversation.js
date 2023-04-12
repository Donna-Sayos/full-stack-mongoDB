import React, { useEffect, useState, useCallback } from "react";
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
  totalConversationCount,
  setTotalConversationCount,
}) {
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const { notifications, clearUserNotif, isReadingHandler } =
    useOnlineContext();
  const userNotifCount = notifications[currentUser._id]?.userNotifications;

  const isFriend = // Check if the current user is the friend
    conversation.members.find((member) => member !== currentUser._id); // FIXME: testing feature

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
      await resetConvoNotification(conversation._id);

      isReadingHandler(currentUser._id, isFriend); // FIXME: testing feature

      setNotificationCount(0);
      setTotalConversationCount(totalConversationCount - notificationCount);

      if (totalConversationCount - notificationCount === 0) {
        await clearUserNotif(currentUser._id);
      }
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

  useEffect(() => {
    if (userNotifCount > 0 && notificationCount > 0) {
      setTotalConversationCount((prev) => prev + notificationCount);
    }
  }, [userNotifCount, notificationCount, setTotalConversationCount]);

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
