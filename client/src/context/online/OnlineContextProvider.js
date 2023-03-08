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
            const updatedNotifications = {
              ...prevNotifications,
              [receiverId]: {
                senderId,
                conversationId,
                userNotifications,
              },
              [senderId]: {
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
                [senderId]: {
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
        }
      );

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  }, []);

  const clearCount = (senderId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications };
      delete updatedNotifications[senderId];
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
    }),
    [onlineUsers, notifications, userNotif, clearCount, clearUserNotif]
  );

  return (
    <OnlineContext.Provider value={memoizedValues}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
