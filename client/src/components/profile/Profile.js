import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import Feed from "../feed/Feed";
import RightSidebar from "../rightSidebar/RightSidebar";

export default function Profile() {
  const [user, setUser] = useState([]);
  const username = useParams().username;
  const specificUser = user.filter((user) => user.username === username)[0];

  const { user: currentUser, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  async function getUser() {
    const { data } = await Axios.get(`/api/v1/users?username=${username}`);
    setUser(data);
  }

  useEffect(() => {
    getUser();
  }, [username]);

  console.log("currentUser", currentUser.username);
  console.log("specificUser", specificUser);

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
                      ? "/assets/" + specificUser.coverPicture
                      : "/assets/" + "user/default-cover.png"
                  }
                  alt="user cover"
                />
                {currentUser.username === specificUser.username && (
                  <div className="logout">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
                <img
                  className="profileUserImg"
                  src={
                    specificUser.profilePicture
                      ? "/assets/" + specificUser.profilePicture
                      : "/assets/" + "user/default-user-photo.png"
                  }
                  alt="user"
                />
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{specificUser.username}</h4>
                {/* <span className="profileInfoDesc">{specificUser.desc}</span> */}
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed username={username} />
              <RightSidebar specificUser={specificUser} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
