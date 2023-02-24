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
import { updateUserCoverPicture } from "../../utils/helper/helperCoverPicture";

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
  const { username } = useParams();
  const [specificUser, setSpecificUser] = useState(null); // initialize as null

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
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      const fileName = shortUuid() + file.name;
      formData.append("name", fileName);
      formData.append("uploadFile", file);

      const uploadResponse = await Axios.post("/api/v1/upload", formData);
      console.log("Upload response data: ", uploadResponse.data);

      if (uploadResponse.status !== 200) {
        throw new Error("File upload failed");
      }

      const { filename } = uploadResponse.data;
      console.log("filename: ", filename);

      const userId =
        specificUser?._id === currentUser._id ? specificUser._id : null;
      console.log("client-side ID", userId);

      await updateUserCoverPicture(userId, filename);

      const updatedUser = { ...specificUser, coverPicture: filename };
      console.log("updatedUser", updatedUser);

      setSpecificUser(updatedUser); // update the state of specificUser with the updated user data

      setUser(user.map((u) => (u._id === specificUser._id ? updatedUser : u))); // update the user state with the updated user data
    } catch (err) {
      console.log("Error updating cover picture", err.message);
    }
  };

  async function getUser() {
    try {
      const { data } = await Axios.get(`/api/v1/users?username=${username}`);
      const user = data.find((u) => u.username === username);
      setSpecificUser(user); // update the state of specificUser with fetched data
    } catch (err) {
      console.log("Error fetching user data", err.message);
    }
  }

  useEffect(() => {
    // Only fetch the user data when the `username` prop changes
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
                  <AiOutlineEdit
                    className="coverEdit"
                    size={20}
                    onClick={handleClick}
                  />
                )}

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
                {currentUser.username === specificUser.username && (
                  <AiOutlineEdit
                    className="profileEdit"
                    size={20}
                    onClick={() => console.log("update profile")}
                  />
                )}
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
