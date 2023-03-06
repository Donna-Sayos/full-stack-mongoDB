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
      ({ senderId, notifications, conversationId }) => {
        setNotifications((prevNotifications) => ({
          ...prevNotifications,
          [conversationId]: { senderId, count: notifications, conversationId },
        }));
        setTotalConversationCount(
          (prevCount) => prevCount + (notifications[conversationId]?.count || 0) // will increment the totalConversationCount state variable by the count for the specific conversation, or by 0 if the count does not exist yet in the notifications state variable
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [currentUser._id]);

  const clearCount = (conversationId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications };
      delete updatedNotifications[conversationId];
      return updatedNotifications;
    });
    setTotalConversationCount(
      (prevCount) => prevCount - (notifications[conversationId]?.count || 0)
    );
  };

  return (
    <OnlineContext.Provider
      value={{
        onlineUsers,
        notifications,
        setNotifications,
        totalConversationCount,
        clearCount,
      }}
    >
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
