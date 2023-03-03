import React from "react";
import "./index.css";
import { format } from "timeago.js";
import ProfilePic from "../../../common/pic/ProfilePic";
import useFetchUsers from "../../../utils/customHooks/UseFetchUsers";

const messageImg = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px",
};

export default function Message({ message, own, sender }) {
  const allUsers = useFetchUsers();
  const senderUser = allUsers.find((user) => user._id === sender);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <ProfilePic user={senderUser} style={messageImg} />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
