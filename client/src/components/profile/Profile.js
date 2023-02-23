import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { AiOutlineEdit } from "react-icons/ai";
import { shortUuid } from "../../utils/helper/helperFunctions";
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

  const handleClick = async () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    const fileName = shortUuid() + file.name;
    formData.append("name", fileName);
    formData.append("uploadFile", file);

    try {
      const uploadResponse = await Axios.post("/api/v1/upload", formData);

      if (uploadResponse.status !== 200) {
        throw new Error("File upload failed");
      }

      // Get the file path from the response and update the user's profile picture
      const { filename } = uploadResponse.data;

      const userId = specificUser._id;
      console.log("userId", userId);

      const updateResponse = await Axios.put(
        "/api/v1/users/" + userId + "/coverPicture",
        {
          coverPicture: filename,
        }
      );
      console.log("Update response: ", updateResponse);

      if (updateResponse.status !== 200) {
        throw new Error("Cover picture update failed");
      }

      const updatedUser = { ...specificUser, coverPicture: filename };
      console.log("updatedUser", updatedUser);

      setUser(user.map((u) => (u._id === specificUser._id ? updatedUser : u)));

      // window.location.reload();
    } catch (err) {
      console.log("Error updating cover picture", err);
    }
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
                <AiOutlineEdit
                  className="coverEdit"
                  size={20}
                  onClick={handleClick}
                />

                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                {currentUser.username === specificUser.username && (
                  <div className="logout">
                    <button ref={recaptchaRef} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
                <ProfilePic user={specificUser} style={profileUserImg} />
                <AiOutlineEdit
                  className="profileEdit"
                  size={20}
                  onClick={() => console.log("update profile")}
                />
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
