import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const OnlineContext = createContext();

export default function OnlineContextProvider({ children, currentUser }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    let socket;
    try {
      socket = io("http://localhost:5001");

      // When connected to the server, emit the "addUser" event to add the current user to the "users" array on the server-side.
      socket.on("connect", () => {
        socket.emit("addUser", currentUser?._id);
      });

      // Listen to the "getUsers" event to update the online status of the users.
      socket.on("getUsers", (users) => {
        setOnlineUsers(users.map((user) => user.userId));
      });

      // Listen to the "getNotification" event to update the notifications of the current user.
      socket.on(
        "getNotification",
        ({ senderId, conversationId, receiverId, count }) => {
          setNotifications((prevNotifications) => ({
            ...prevNotifications,
            [senderId]: {
              receiverId,
              count,
              conversationId,
            },
          }));
        }
      );

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  }, [currentUser?._id]);

  const clearCount = (senderId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications };
      delete updatedNotifications[senderId];
      return updatedNotifications;
    });
  };

  return (
    <OnlineContext.Provider
      value={{
        onlineUsers,
        notifications,
        clearCount,
      }}
    >
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
