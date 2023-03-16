import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { useOnlineContext } from "../../context/online/OnlineContextProvider";
import { incrementConvoNotification } from "../../utils/helper/helperFunctions";
import { io } from "socket.io-client";
import TopNav from "../topNav/TopNav";
import Conversation from "./conversation/Conversation";
import Message from "./message/Message";
import ChatOnline from "./chatOnline/ChatOnline";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useAuthContext();
  const { arrivalMessage, inChat } = useOnlineContext();
  const socket = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:5001");
    socket.current.emit("addUser", user._id);

    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await Axios.get("/api/v1/conversations/" + user._id);
        setConversations(res.data.conversations);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await Axios.get("/api/v1/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  const handleSend = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    try {
      if (onlineUsers.includes(receiverId)) {
        const res = await Axios.post("/api/v1/messages", message);

        // emit the message via Socket.io
        socket.current.emit("sendMessage", {
          senderId: user._id,
          receiverId,
          text: newMessage,
          conversationId: currentChat._id,
        });

        setMessages([...messages, res.data]);
        setNewMessage("");

        // Send a notification to the recipient
        socket.current.emit("sendNotification", {
          senderId: user._id,
          conversationId: currentChat._id,
          receiverId,
        });

        await incrementConvoNotification(currentChat._id);

        // Clear the notification count for the conversation
        setNotificationCount(0);
      } else {
        // Display a notification to the user that the recipient is offline
        console.log(
          "Recipient is offline. Message will be delivered once they come online."
        );
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
                  currentUser={user}
                  notificationCount={notificationCount}
                  setNotificationCount={setNotificationCount}
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
                  {inChat &&
                    messages.map((m, index) => (
                      <div key={m._id || index} ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.sender === user._id}
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
              currentUserId={user._id}
              setCurrentChat={setCurrentChat}
              setConversations={setConversations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
