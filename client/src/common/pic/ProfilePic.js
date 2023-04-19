import React, { useState, useEffect } from "react";
import "./index.css";

export default function ProfilePic({ user, style }) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, user?.profilePicture]); // FIXME: not updating when uploading new picture

  return (
    <img
      className="prof"
      src={
        currentUser?.profilePicture
          ? "/assets/" + currentUser?.profilePicture
          : "/assets/" + "user/default-user-photo.png"
      }
      alt="user"
      style={style}
    />
  );
}
