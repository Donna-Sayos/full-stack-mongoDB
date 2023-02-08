import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useParams } from "react-router";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import Feed from "../feed/Feed";
import RightSidebar from "../rightSidebar/RightSidebar";

export default function Profile() {
  const [user, setUser] = useState([]);
  const username = useParams().username;
  const specificUser = user.filter((user) => user.username === username)[0];

  async function getUser() {
    const { data } = await Axios.get(`/api/v1/users?username=${username}`);
    setUser(data);
  }

  useEffect(() => {
    getUser();
  }, [username]);

  return (
    <>
      <TopNav />
      <div className="profile">
        <Sidebar />
        {specificUser && (
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  className="profileCoverImg"
                  src={
                    specificUser.coverPicture
                      ? "/images/" + specificUser.coverPicture
                      : "/images/" + "avatar/default-cover.png"
                  }
                  alt="user cover"
                />
                <img
                  className="profileUserImg"
                  src={
                    specificUser.profilePicture
                      ? "/images/" + specificUser.profilePicture
                      : "/images/" + "avatar/default-user-photo.png"
                  }
                  alt="user"
                />
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{specificUser.username}</h4>
                <span className="profileInfoDesc">{specificUser.desc}</span>
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed username={username} />
              <RightSidebar user={user} specificUser={{ specificUser }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
