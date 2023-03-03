import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/auth/AuthProvider";
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
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuthContext();
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:5001");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        profilePicture: data.profilePicture,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await Axios.get("/api/v1/conversations/" + user._id);
        setConversations(res.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    const message = {
      sender: user._id,
      profilePicture: user.profilePicture,
      text: newMessage,
      conversationId: currentChat._id,
    };

    if (onlineUsers.includes(receiverId)) {
      socket.current.emit("sendMessages", {
        senderId: user._id,
        receiverId,
        text: newMessage,
        profilePicture: user.profilePicture,
      });
    }

    try {
      const res = await Axios.post("/api/v1/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");

      if (!onlineUsers.includes(receiverId)) {
        // Display a notification to the user that the recipient is offline
        console.log(
          "Recipient is offline. Message will be delivered once they come online."
        );
      }
    } catch (err) {
      console.log(err);
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
            <input
              placeholder="Search"
              className="form-control chatMenuInput mb-2"
            />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
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
                    <div key={index} ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
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
                  <button className="chatSubmitButton" onClick={handleSubmit}>
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
