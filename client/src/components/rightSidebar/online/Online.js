import React from "react";
import "../index.css";
import ProfilePic from "../../../common/pic/ProfilePic";
import useFetchUsers from "../../../utils/customHooks/UseFetchUsers";

const rightSidebarProfileImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
};

export default function Online({ userId }) {
  const allUsers = useFetchUsers();
  const onlineUsers = allUsers.find((u) => u._id === userId);

  return (
    <>
      <li className="rightSidebarFriend">
        <div className="rightSidebarProfileImgContainer">
          <ProfilePic style={rightSidebarProfileImg} user={onlineUsers} />
          <span className="rightSidebarOnline"></span>
        </div>
        <div className="rightSidebarUsername">
          {onlineUsers?.username}
          <span style={{ color: "gray" }}>({onlineUsers?.pronouns})</span>
        </div>
      </li>
    </>
  );
}
