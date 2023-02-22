import React from "react";
import "./index.css";

export default function ProfilePic({ user, style }) {
  return (
    <img
      className="prof"
      src={
        user.profilePicture
          ? "/assets/" + user.profilePicture
          : "/assets/" + "user/default-user-photo.png"
      }
      alt="user"
      style={style}
    />
  );
}

