import React from "react";
import "./index.css";
import { format } from "timeago.js";
import ProfilePic from "../../../common/pic/ProfilePic";

const messageImg = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px",
};

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <ProfilePic user={message} style={messageImg} />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
