import React, { useState, useEffect } from "react";
import "./index.css";
import { useParams } from "react-router";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";

export default function Profile() {
  const [route, setRoute] = useState({});
  const [user, setUser] = useState({});
  const username = useParams().username;

  async function getEnv() {
    const response = await fetch("http://localhost:5001/env");
    const env = await response.json();
    setRoute(env);
  }

  async function getUser() {
    const response = await fetch(`${route.GET_USERS}?username=${username}`);
    const user = await response.json();
    setUser(user);
  }

  useEffect(() => {
    getEnv();
  }, []);
  return (
    <>
      <TopNav />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "user/default-cover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? route.FILES_ROUTE + user.profilePicture
                    : route.FILES_ROUTE + "user/default-user-photo.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          {/* <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div> */}
        </div>
      </div>
    </>
  );
}
