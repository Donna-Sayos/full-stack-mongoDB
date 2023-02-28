import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";

const conversationImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "20px",
};

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  console.log("Conversation.js: conversation: ", conversation);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    console.log("Conversation.js: friendId: ", friendId);

    const getUser = async () => {
      try {
        const res = await Axios("/api/v1/users?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [currentUser, conversation]);

  console.log("Conversation.js: user: ", user)
  console.log("Conversation.js: currentUser: ", currentUser)

  return (
    <div className="conversation">
      <ProfilePic user={user} style={conversationImg} />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}

