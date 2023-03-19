import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";

const ChatContext = createContext();

export default function ChatContextProvider({ children }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState(null);

  const memoizedValues = useMemo(
    () => ({
      selectedConversation,
      setSelectedConversation,
      notification,
      setNotification,
      chats,
      setChats,
    }),
    [selectedConversation, notification, chats]
  );

  return (
    <ChatContext.Provider value={memoizedValues}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
