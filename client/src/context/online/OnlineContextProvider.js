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
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (!currentUser) {
        setIsLoading(false); // Set isLoading to false if there's no current user
        return;
      }

      const newSocket = io("http://localhost:5001");
      setSocket(newSocket);

      // When connected to the server, emit the "addUser" event to add the current user to the "users" array on the server-side.
      newSocket.on("connect", () => {
        newSocket.emit("addUser", currentUser?._id);
      });

      // Listen to the "getUsers" event to update the online status of the users.
      newSocket.on("getUsers", (users) => {
        setOnlineUsers(
          // .userId is the user id of the user in the "users" array on the server-side socket.
          users.map(
            (user) => user.userId
            // currentUser?.followings.filter((f) =>
            //   users.some((u) => u.userId === f)
          )
        );
        setIsLoading(false); // Set isLoading to false when onlineUsers are updated
      });

      // getMessage
      newSocket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });

      // Listen to the "getNotification" event to update the notifications of the current user.
      newSocket.on(
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
      setIsLoading(false); // Set isLoading to false if there's an error
    }

    // Return a cleanup function to disconnect the socket when the component unmounts
    return () => {
      if (socket) socket.disconnect();
    };
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
      isLoading,
      setOnlineUsers,
      clearUserNotif,
      activateInChat,
      deactivateInChat,
      setIsLoading,
    }),
    [
      onlineUsers,
      arrivalMessage,
      notifications,
      userNotif,
      inChat,
      isLoading,
      setOnlineUsers,
      clearUserNotif,
      activateInChat,
      deactivateInChat,
      setIsLoading,
    ]
  );

  return (
    <OnlineContext.Provider value={memoizedValues}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
