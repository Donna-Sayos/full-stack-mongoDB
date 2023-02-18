import React from "react";
import "../index.css";
import ProfilePic from "../../../common/pic/ProfilePic";
import useFetchUsers from "../../../utils/customHooks/UseFetchUsers";

const sidebarFriendImg = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px",
};

export default function Friends({ userId }) {
  const allUsers = useFetchUsers();
  const friends = allUsers.filter((u) => u._id === userId);

  return (
    <div className="sidebarFriend">
      {friends && friends.length > 0
        ? friends.map((f) => (
            <li className="sidebarFriend" key={f._id}>
              <ProfilePic style={sidebarFriendImg} user={f} />
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
