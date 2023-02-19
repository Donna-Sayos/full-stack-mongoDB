import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthProvider";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import Feed from "./feed/Feed";
import RightSidebar from "../rightSidebar/RightSidebar";
import ProfilePic from "../../common/pic/ProfilePic";

const profileUserImg = {
  width: "150px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "50%",
  border: "3px solid #fff",
  position: "absolute",
  top: "150px",
  left: "0",
  right: "0",
  margin: "auto",
};

export default function Profile({ resetRecaptcha, recaptchaRef }) {
  const [user, setUser] = useState([]);
  const username = useParams().username;
  const specificUser = user.filter((user) => user.username === username)[0];

  const { user: currentUser, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    resetRecaptcha();
  };

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
                      ? "/assets/" + specificUser.coverPicture
                      : "/assets/" + "user/default-cover.png"
                  }
                  alt="user cover"
                />
                {currentUser.username === specificUser.username && (
                  <div className="logout">
                    <button ref={recaptchaRef} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
                <ProfilePic user={specificUser} style={profileUserImg} />
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{specificUser.username}</h4>
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed username={username} currentUser={currentUser} />
              <RightSidebar specificUser={specificUser} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
