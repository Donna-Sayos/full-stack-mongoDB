import React, { useState, useEffect } from "react";
import "../index.css";
import Axios from "axios";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import ProfilePic from "../../../common/pic/ProfilePic";

export default function Online({ userId }) {
  const [otherUsers, setOtherUsers] = useState([]);
  const { user: currentUser } = useAuthContext();

  const onlineUser = otherUsers.filter((u) => u._id === userId)[0];

  async function getUsers() {
    const { data } = await Axios.get("/api/v1/users");
    setOtherUsers(data.filter((u) => u._id !== currentUser._id));
  }

  useEffect(() => {
    getUsers();
  }, []);

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
