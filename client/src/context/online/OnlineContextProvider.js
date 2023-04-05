import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import io from "socket.io-client";

const OnlineContext = createContext();

export default function OnlineContextProvider({ children, currentUser }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [readingChat, setReadingChat] = useState({});
  const socket = useRef({ current: null });

  useEffect(() => {
    try {
      if (!currentUser) {
        setIsLoading(false); // Set isLoading to false if there's no current user
        return;
      }

      socket.current = io("http://localhost:5001");

      // When connected to the server, emit the "addUser" event to add the current user to the "users" array on the server-side.
      socket.current.on("connect", () => {
        socket.current.emit("addUser", currentUser?._id);
      });

      // Listen to the "getUsers" event to update the online status of the users.
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(
          // .userId is the user id of the user in the "users" array on the server-side socket.
          users.map((user) => user.userId)
        );
        setIsLoading(false); // Set isLoading to false when onlineUsers are updated
      });

      // listen for the updateOnlineUsers event and update the onlineUsers state
      socket.current.on("updateOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // getMessage
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });

      // getIsReading
      socket.current.on("getIsReading", ({ senderId, isReading }) => {
        console.log("senderId:", senderId, "isReading:", isReading);
        setReadingChat((prevReadingChat) => {
          const updatedReadingChat = {
            ...prevReadingChat,
            [senderId]: {
              isReading: prevReadingChat[senderId]?.isReading || isReading,
            },
          };
          return updatedReadingChat;
        });
      });

      // Listen to the "getNotification" event to update the notifications of the current user.
      socket.current.on(
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
            };
            return updatedNotifications;
          });
        }
      );

      //resetNotification
      socket.current.on("resetNotification", (data) => {
        const updatedNotifications = {
          ...notifications,
          [data.receiverId]: {
            ...notifications[data.receiverId],
            userNotifications: 0,
          },
        };
        setNotifications(updatedNotifications);
      });

      // resetIsReading
      socket.current.on("resetIsReading", ({ senderId, isReading }) => {
        setReadingChat((prevReadingChat) => {
          const updatedReadingChat = {
            ...prevReadingChat,
            [senderId]: {
              isReading: prevReadingChat[senderId]?.isReading || isReading,
            },
          };
          return updatedReadingChat;
        });
      });

      // Return a cleanup function to disconnect the socket when the component unmounts
      return () => {
        if (socket.current) socket.current.disconnect();
      };
    } catch (err) {
      console.log(`Error connecting to socket: ${err}`);
      setIsLoading(false); // Set isLoading to false if there's an error
    }
  }, [currentUser, notifications, readingChat]);

  const clearUserNotif = useCallback((receiverId) => {
    socket.current.emit("resetNotification", {
      receiverId,
    });
  }, []);

  // send a message to the recipient
  const sendMessage = useCallback(
    (senderId, receiverId, text, conversationId) => {
      socket.current.emit("sendMessage", {
        senderId,
        receiverId,
        text,
        conversationId,
      });
    },
    []
  );

  // Send a notification to the recipient
  const sendNotification = useCallback(
    (senderId, conversationId, receiverId) => {
      socket.current.emit("sendNotification", {
        senderId,
        conversationId,
        receiverId,
      });
    },
    []
  );

  // Set the isReading property of the recipient to true
  const isReadingHandler = useCallback((senderId) => {
    socket.current.emit("setIsReading", {
      senderId,
    });
  }, []);

  const resetIsReadingHandler = useCallback((senderId) => {
    socket.current.emit("resetIsReading", {
      senderId,
    });
  }, []);

  const memoizedValues = useMemo(
    () => ({
      onlineUsers,
      arrivalMessage,
      notifications,
      isLoading,
      readingChat,
      setOnlineUsers,
      clearUserNotif,
      setIsLoading,
      sendMessage,
      sendNotification,
      isReadingHandler,
      resetIsReadingHandler,
    }),
    [onlineUsers, arrivalMessage, notifications, isLoading, readingChat]
  );

  return (
    <OnlineContext.Provider value={memoizedValues}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineContext = () => useContext(OnlineContext);
