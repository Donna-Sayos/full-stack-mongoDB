import React from "react";
import "./index.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  console.log("message: ", message);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            message.profilePicture
              ? "/assets/" + message.profilePicture
              : "/assets/" + "user/default-user-photo.png"
          }
          alt="user"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
