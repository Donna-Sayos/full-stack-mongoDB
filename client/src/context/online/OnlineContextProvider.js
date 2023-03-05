import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const OnlineContext = createContext();

export default function OnlineContextProvider({ children, currentUser }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState({ count: 0 });

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
    socket.on("getNotification", ({ senderId, notifications }) => {
      setNotifications((prevNotifications) => ({
        ...prevNotifications,
        senderId: [senderId],
        count: notifications,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser._id]);

  return (
    <OnlineContext.Provider
      value={{ onlineUsers, notifications, setNotifications }}
    >
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
