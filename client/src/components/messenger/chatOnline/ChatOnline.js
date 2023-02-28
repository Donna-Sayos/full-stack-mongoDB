import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";

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
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await Axios.get("/api/v1/users/friends/" + currentUserId);
      setFriends(res.data.friends);
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

  const handleClick = async (user) => {
    try {
      const res = await Axios.get(
        `/api/v1/conversations/find/${currentUserId}/${user._id}`
      );
      setCurrentChat(res.data);
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
            onClick={() => handleClick(online)}
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

