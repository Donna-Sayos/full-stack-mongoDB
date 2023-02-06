import React from "react";
import "./index.css";

export default function Friends({ user }) {
  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={
          user.profilePicture
            ? "/images/" + user.profilePicture
            : "/images/" + "avatar/default-user-photo.png"
        }
        alt="friend"
      />
      <span className="sidebarFriendName">{user.firstName}</span>
    </li>
  );
}
