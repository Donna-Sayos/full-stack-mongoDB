import React from "react";
import "./index.css";

export default function Friends({ user }) {
  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={
          user.profilePicture
            ? "/assets/" + user.profilePicture
            : "/assets/" + "user/default-user-photo.png"
        }
        alt="friend"
      />
      <div className="sidebarFriendName">
        {user.username} <span style={{ color: "gray" }}>({user.pronouns})</span>
      </div>
    </li>
  );
}
