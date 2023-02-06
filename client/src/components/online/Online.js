import React from "react";
import "./index.css";

export default function Online({ user }) {
  return (
    <li className="rightSidebarFriend">
      <div className="rightSidebarProfileImgContainer">
        <img
          className="rightSidebarProfileImg"
          src={
            user.profilePicture
              ? "/images/" + user.profilePicture
              : "/images/" + "avatar/default-user-photo.png"
          }
          alt="user"
        />
        <span className="rightSidebarOnline"></span>
      </div>
      <div className="rightSidebarUsername">
        {user.username} <span style={{ color: "gray" }}>({user.pronouns})</span>
      </div>
    </li>
  );
}
