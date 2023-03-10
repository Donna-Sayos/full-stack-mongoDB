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
            // Initialize prevNotifications object
            let updatedPrevNotifications = { ...prevNotifications };

            const senderReceiverKey = `${senderId}-${receiverId}`;
            const receiverSenderKey = `${receiverId}-${senderId}`;

            // Update the notification count for the conversation
            const conversationNotifications =
              prevNotifications[conversationId] || {};
            const updatedConversationNotifications = {
              ...conversationNotifications,
              [senderId]: {
                senderId,
                receiverId,
                conversationId,
                userNotifications,
              },
            };

            // Update the notifications object
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

            // If the conversation key does not exist yet, create a new object with the senderId
            if (!prevNotifications[conversationId]) {
              updatedNotifications[conversationId] = {
                [senderId]: {
                  senderId,
                  receiverId,
                  conversationId,
                  userNotifications,
                },
              };
            } else {
              updatedNotifications[conversationId] =
                updatedConversationNotifications;
            }

            // Loop through notifications and update prevNotifications
            Object.values(updatedNotifications).forEach((notification) => {
              const conversationId =
                notification.senderId < notification.receiverId
                  ? `${notification.senderId}-${notification.receiverId}`
                  : `${notification.receiverId}-${notification.senderId}`;

              // Check if conversation already exists in prevNotifications object
              if (!updatedPrevNotifications[conversationId]) {
                updatedPrevNotifications[conversationId] = {
                  ...notification,
                  userNotifications: 1,
                };
              } else {
                // Increment userNotifications count for the specific conversation
                updatedPrevNotifications[
                  conversationId
                ].userNotifications += 1;
              }
            });

            return updatedNotifications;
          });

          // Update the user notification count
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
        }
      );
    } catch (err) {
      console.log(`Error connecting to socket: ${err}`);
    }
  }, []);

  // const clearCount = (senderId, currentUser, conversationId) => { FIXME: Fix this function
  //   setNotifications((prevNotifications) => {
  //     const updatedNotifications = { ...prevNotifications };

  //     // Clear the notification count for the conversation and sender
  //     const conversationKey = conversationId;
  //     const conversationNotifications =
  //       updatedNotifications[conversationKey] || {};
  //     const updatedConversationNotifications = { ...conversationNotifications };
  //     delete updatedConversationNotifications[senderId];
  //     updatedNotifications[conversationKey] = updatedConversationNotifications;
  //     delete updatedNotifications[`${senderId}-${currentUser?._id}`];

  //     return updatedNotifications;
  //   });
  // };

  const clearUserNotif = () => {
    setUserNotif(0);
  };

  const memoizedValues = useMemo(
    () => ({
      onlineUsers,
      notifications,
      // clearCount,
      userNotif,
      clearUserNotif,
    }),
    [
      onlineUsers,
      notifications,
      userNotif,
      // clearCount,
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
