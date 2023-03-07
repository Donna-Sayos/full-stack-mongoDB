import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const OnlineContext = createContext();

export default function OnlineContextProvider({ children, currentUser }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState({});
  const [totalConversationCount, setTotalConversationCount] = useState(0); // add state for total count

  useEffect(() => {
    const socket = io("http://localhost:5001");

    // When connected to the server, emit the "addUser" event to add the current user to the "users" array on the server-side.
    socket.on("connect", () => {
      socket.emit("addUser", currentUser._id);
    });

    // Listen to the "getUsers" event to update the online status of the users.
    socket.on("getUsers", (users) => {
      setOnlineUsers(users.map((user) => user.userId));
    });

    // Listen to the "getNotification" event to update the notifications of the current user.
    socket.on(
      "getNotification",
      ({ senderId, notifications, conversationId, receiverId }) => {
        setNotifications((prevNotifications) => ({
          ...prevNotifications,
          [senderId]: {
            receiverId,
            count: notifications,
            conversationId,
          },
        }));

        if (receiverId === currentUser._id) {
          setTotalConversationCount((prevCount) => {
            const prevNotificationCount = notifications[senderId]?.count || 0;
            const newNotificationCount = notifications || 0;
            return prevCount - prevNotificationCount + newNotificationCount;
          });
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [currentUser._id]);

  const clearCount = (senderId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications };
      delete updatedNotifications[senderId];
      return updatedNotifications;
    });

    setTotalConversationCount((prevCount) => {
      const prevNotificationCount = notifications[senderId]?.count || 0;
      return prevCount - prevNotificationCount;
    });
  };

  return (
    <OnlineContext.Provider
      value={{
        onlineUsers,
        notifications,
        totalConversationCount,
        clearCount,
      }}
    >
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
