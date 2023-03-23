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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let socket;

    try {
      if (!currentUser) {
        setIsLoading(false); // Set isLoading to false if there's no current user
        return;
      }

      socket = io("http://localhost:5001");

      // When connected to the server, emit the "addUser" event to add the current user to the "users" array on the server-side.
      socket.on("connect", () => {
        socket.emit("addUser", currentUser?._id);
      });

      // Listen to the "getUsers" event to update the online status of the users.
      socket.on("getUsers", (users) => {
        setOnlineUsers(
          // .userId is the user id of the user in the "users" array on the server-side socket.
          users.map((user) => user.userId)
        );
        setIsLoading(false); // Set isLoading to false when onlineUsers are updated
      });

      // listen for the updateOnlineUsers event and update the onlineUsers state
      socket.on("updateOnlineUsers", (users) => {
        setOnlineUsers(users);
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
      // socket.on(
      //   "getNotification",
      //   ({ senderId, conversationId, receiverId, userNotifications }) => {
      //     setNotifications((prevNotifications) => {
      //       const updatedConversationNotifications = {
      //         ...prevNotifications,
      //         [senderId]: {
      //           senderId,
      //           receiverId,
      //           conversationId,
      //           userNotifications,
      //         },
      //       };

      //       return updatedConversationNotifications;
      //     });

      //     // Update the user notification count
      //     if (receiverId === currentUser?._id) {
      //       setUserNotif(() => {
      //         const totalUserNotif = Object.values({
      //           ...notifications,
      //           [conversationId]: {
      //             senderId,
      //             receiverId,
      //             conversationId,
      //             userNotifications,
      //           },
      //         }).reduce(
      //           (acc, { userNotifications }) => acc + userNotifications,
      //           0
      //         );
      //         return totalUserNotif;
      //       });
      //     } else {
      //       setUserNotif(0);
      //     }
      //   }
      // );

      // Return a cleanup function to disconnect the socket when the component unmounts
      return () => {
        if (socket) socket.disconnect();
      };
    } catch (err) {
      console.log(`Error connecting to socket: ${err}`);
      setIsLoading(false); // Set isLoading to false if there's an error
    }
  }, [currentUser, notifications]);

  const clearUserNotif = () => {
    setUserNotif(0);
  };

  const memoizedValues = useMemo(
    () => ({
      onlineUsers,
      arrivalMessage,
      notifications,
      userNotif,
      isLoading,
      setOnlineUsers,
      setNotifications,
      clearUserNotif,
      setIsLoading,
    }),
    [
      onlineUsers,
      arrivalMessage,
      notifications,
      userNotif,
      isLoading,
      setOnlineUsers,
      setNotifications,
      clearUserNotif,
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
