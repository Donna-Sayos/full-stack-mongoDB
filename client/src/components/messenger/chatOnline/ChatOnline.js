import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";
import { useOnlineContext } from "../../../context/online/OnlineContextProvider";

const chatOnlineImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "1px solid white",
};

export default function ChatOnline({
  onlineUsers,
  currentUserId,
  setCurrentChat,
  setConversations,
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { isReadingHandler } = useOnlineContext();

  useEffect(() => {
    const getFriends = async () => {
      const { data } = await Axios.get(
        "/api/v1/users/friends/" + currentUserId
      );
      setFriends(data.friends);
    };

    getFriends();
  }, [currentUserId]);

  useEffect(() => {
    if (!friends) return;
    setOnlineFriends(
      Array.isArray(friends) &&
        friends.filter((f) => onlineUsers.includes(f._id))
    );
  }, [friends, onlineUsers]);

  const handleClick = async (friendId) => {
    try {
      isReadingHandler(currentUserId); // FIXME: testing feature
      const { data } = await Axios.get(
        `/api/v1/conversations/find/${currentUserId}/${friendId}`
      );
      if (data) {
        // If conversation already exists, set it as current chat
        setCurrentChat(data);
      } else {
        // If conversation doesn't exist, create a new conversation
        const { data } = await Axios.post("/api/v1/conversations", {
          senderId: currentUserId,
          receiverId: friendId,
        });
        setCurrentChat(data);
        setConversations((conversations) => [...conversations, data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends &&
        onlineFriends.map((online) => (
          <div
            key={online._id}
            className="chatOnlineFriend"
            onClick={() => handleClick(online._id)}
          >
            <div className="chatOnlineImgContainer">
              <ProfilePic user={online} style={chatOnlineImg} />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{online?.username}</span>
          </div>
        ))}
    </div>
  );
}
