import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { useOnlineContext } from "../../context/online/OnlineContextProvider";
import { incrementConvoNotification } from "../../utils/helper/helperFunctions";
import TopNav from "../topNav/TopNav";
import Conversation from "./conversation/Conversation";
import Message from "./message/Message";
import ChatOnline from "./chatOnline/ChatOnline";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [totalConversationCount, setTotalConversationCount] = useState(0);
  const { user: currentUser } = useAuthContext();
  const {
    onlineUsers,
    arrivalMessage,
    sendMessage,
    sendNotification,
    // readingChat, // FIXME: testing feature
  } = useOnlineContext();
  const scrollRef = useRef();
  const receiverId = currentChat?.members.find(
    (member) => member !== currentUser._id
  );
  const message = {
    sender: currentUser?._id,
    text: newMessage,
    conversationId: currentChat?._id,
  };
  // const receiverReadingState = readingChat[receiverId]?.isReading || false; // FIXME: testing feature
  // const senderReadingState = readingChat[currentUser?._id]?.isReading || false; // FIXME: testing feature

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const { data } = await Axios.get(
          "/api/v1/conversations/" + currentUser._id
        );
        setConversations(data.conversations);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, [currentUser._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await Axios.get(
          "/api/v1/messages/" + currentChat?._id
        );
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  const handleSend = async (e) => {
    e.preventDefault();

    const { data } = await Axios.post("/api/v1/messages", message);

    if (newMessage === "") {
      return;
    }

    try {
      if (onlineUsers.includes(receiverId)) {
        // sendMessage(currentUser._id, receiverId, newMessage, currentChat._id);
        // setMessages([...messages, data]);
        // setNewMessage("");
      // } else {
        sendMessage(currentUser._id, receiverId, newMessage, currentChat._id);
        sendNotification(currentUser._id, currentChat._id, receiverId);
        setMessages([...messages, data]);
        setNewMessage("");

        await incrementConvoNotification(currentChat._id);
      } else {
        setMessages([...messages, data]);
        setNewMessage("");

        await incrementConvoNotification(currentChat._id);
      }
    } catch (err) {
      console.log(`Error sending message and notification: ${err}`);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <TopNav />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="container mb-4">
              <input
                placeholder="Search"
                className="form-control chatMenuInput mb-2 mx-auto"
                style={{ maxWidth: 400 }}
              />
            </div>
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <hr className="convoHr" />
                <Conversation
                  conversation={c}
                  currentUser={currentUser}
                  totalConversationCount={totalConversationCount}
                  setTotalConversationCount={setTotalConversationCount}
                />
                <hr className="convoHr" />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, index) => (
                    <div key={m._id || index} ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === currentUser._id}
                        sender={m.sender}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput form-control"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    rows={3}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSend}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentUserId={currentUser._id}
              setCurrentChat={setCurrentChat}
              setConversations={setConversations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
