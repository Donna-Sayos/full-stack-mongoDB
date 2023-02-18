import React from "react";

export default function ProfilePic({ user }) {
  return (
    <img
      className="profileImg"
      src={
        user.profilePicture
          ? "/assets/" + user.profilePicture
          : "/assets/" + "user/default-user-photo.png"
      }
      alt="user"
    />
  );
}
