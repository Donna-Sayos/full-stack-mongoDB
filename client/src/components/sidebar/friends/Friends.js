import React, { useState, useEffect } from "react";
import "../index.css";
import Axios from "axios";
import ProfilePic from "../../../common/pic/ProfilePic";

export default function Friends({ user }) {
  const [otherUsers, setOtherUsers] = useState([]);
  const friends = otherUsers.filter((u) => u._id === user);

  async function getUsers() {
    const { data } = await Axios.get("/api/v1/users");
    setOtherUsers(data.filter((u) => u._id !== user._id));
  }

  useEffect(() => {
    getUsers();
  }, []);
  
  return (
    <div className="sidebarFriend">
      {friends && friends.length > 0
        ? friends.map((f) => (
            <li className="sidebarFriend" key={f._id}>
              <ProfilePic className="sidebarFriendImg" user={f} />
              <div className="sidebarFriendName">
                {f.username}{" "}
                <span style={{ color: "gray" }}>({f.pronouns})</span>
              </div>
            </li>
          ))
        : null}
    </div>
  );
}
