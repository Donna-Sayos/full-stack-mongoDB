import React from "react";
import "../index.css";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import ProfilePic from "../../../common/pic/ProfilePic";
import useFetchUsers from "../../../utils/customHooks/UseFetchUsers";

export default function Online({ userId }) {
  const { user: currentUser } = useAuthContext();
  const allUsers = useFetchUsers();
  const onlineUser = allUsers.find(
    (u) => u._id === userId && u._id !== currentUser._id
  );

  return (
    <>
      {onlineUser && (
        <li className="rightSidebarFriend">
          <div className="rightSidebarProfileImgContainer">
            <ProfilePic className="rightSidebarProfileImg" user={onlineUser} />
            <span className="rightSidebarOnline"></span>
          </div>
          <div className="rightSidebarUsername">
            {onlineUser.username}{" "}
            <span style={{ color: "gray" }}>({onlineUser.pronouns})</span>
          </div>
        </li>
      )}
    </>
  );
}
