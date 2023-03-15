import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import io from "socket.io-client";

const OnlineContext = createContext();

export default function OnlineContextProvider({ children, currentUser }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [userNotif, setUserNotif] = useState(0);
  const [inChat, setInChat] = useState(false);

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
        setOnlineUsers(users.map((user) => user._id === currentUser?._id));
      });

      // getMessage
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });

      // Listen to the "getNotification" event to update the notifications of the current user.
      socket.on(
        "getNotification",
        ({ senderId, conversationId, receiverId, userNotifications }) => {
          setNotifications((prevNotifications) => {
            const updatedConversationNotifications = {
              ...prevNotifications,
              [senderId]: {
                senderId,
                receiverId,
                conversationId,
                userNotifications,
              },
            };

            return updatedConversationNotifications;
          });

          // Update the user notification count
          if (receiverId === currentUser?._id) {
            if (inChat === false) {
              setUserNotif(() => {
                const totalUserNotif = Object.values({
                  ...notifications,
                  [conversationId]: {
                    senderId,
                    receiverId,
                    conversationId,
                    userNotifications,
                  },
                }).reduce(
                  (acc, { userNotifications }) => acc + userNotifications,
                  0
                );
                return totalUserNotif;
              });
            } else {
              setUserNotif(0);
            }
          }
        }
      );
    } catch (err) {
      console.log(`Error connecting to socket: ${err}`);
    }
  }, [currentUser, inChat, notifications]);

  const clearUserNotif = () => {
    setUserNotif(0);
  };

  const activateInChat = () => {
    setInChat(true);
  };

  const deactivateInChat = () => {
    setInChat(false);
  };

  const memoizedValues = useMemo(
    () => ({
      onlineUsers,
      arrivalMessage,
      notifications,
      userNotif,
      inChat,
      clearUserNotif,
      activateInChat,
      deactivateInChat,
    }),
    [
      onlineUsers,
      arrivalMessage,
      notifications,
      userNotif,
      inChat,
      clearUserNotif,
      activateInChat,
      deactivateInChat,
    ]
  );

  return (
    <OnlineContext.Provider value={memoizedValues}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
