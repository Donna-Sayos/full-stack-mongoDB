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
  const [notifications, setNotifications] = useState({});
  const [userNotif, setUserNotif] = useState(0);
  const [senderNotif, setSenderNotif] = useState(0);

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
        ({ senderId, conversationId, receiverId, userNotifications }) => {
          setNotifications((prevNotifications) => {
            const senderReceiverKey = `${senderId}-${receiverId}`;
            const receiverSenderKey = `${receiverId}-${senderId}`;
            const updatedNotifications = {
              ...prevNotifications,
              [senderReceiverKey]: {
                senderId,
                receiverId,
                conversationId,
                userNotifications,
              },
              [receiverSenderKey]: {
                senderId,
                receiverId,
                conversationId,
                userNotifications,
              },
            };
            return updatedNotifications;
          });

          if (receiverId === currentUser?._id) {
            setUserNotif(() => {
              const totalUserNotif = Object.values({
                ...notifications,
                [`${senderId}-${receiverId}`]: {
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
          }

          if (conversationId) {
            setSenderNotif(() => {
              const totalSenderNotif = Object.values({
                ...notifications,
                [`${senderId}-${receiverId}`]: {
                  senderId,
                  receiverId,
                  conversationId,
                  userNotifications,
                },
              }).reduce(
                (acc, { userNotifications }) => acc + userNotifications,
                0
              );
              return totalSenderNotif;
            });
          }
        }
      );

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  }, []);

  const clearCount = (senderId, currentUser) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications };
      delete updatedNotifications[`${senderId}-${currentUser?._id}`];
      return updatedNotifications;
    });
  };

  const clearUserNotif = () => {
    setUserNotif(0);
  };

  const memoizedValues = useMemo(
    () => ({
      onlineUsers,
      notifications,
      clearCount,
      userNotif,
      clearUserNotif,
      senderNotif,
    }),
    [
      onlineUsers,
      notifications,
      userNotif,
      senderNotif,
      clearCount,
      clearUserNotif,
    ]
  );

  return (
    <OnlineContext.Provider value={memoizedValues}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
