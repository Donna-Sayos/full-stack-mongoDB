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
import { updateUserProfilePicture } from "../../utils/helper/helperProfilePicture";
import { useOnlineContext } from "../../context/online/OnlineContextProvider";

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
  const { disconnect, setIsLoading } = useOnlineContext();
  const isCurrentUser = currentUser.username === specificUser?.username;
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);

    if (currentUser) {
      disconnect();
      dispatch({ type: "LOGOUT" });
      navigate("/");
      resetRecaptcha();
    }
  };

  const handleClickCover = async () => {
    const fileInput = document.getElementById("fileInputCoverPic");
    fileInput.click();
  };

  const handleClickProfile = async () => {
    const fileInput = document.getElementById("fileInputProfilePic");
    fileInput.click();
  };

  const handlePictureUpload = async (event, pictureType) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      const fileName = shortUuid() + file.name;
      formData.append("name", fileName);
      formData.append("uploadFile", file);

      const uploadResponse = await Axios.post("/api/v1/upload", formData);

      if (uploadResponse.status !== 200) {
        throw new Error("File upload failed");
      }

      const { filename } = uploadResponse.data;
      const userId =
        specificUser?._id === currentUser._id ? specificUser._id : null;

      if (pictureType === "coverPicture") {
        await updateUserCoverPicture(userId, filename);
        const updatedUser = { ...specificUser, coverPicture: filename };
        setSpecificUser(updatedUser);
        setUser(
          user.map((u) => (u._id === specificUser._id ? updatedUser : u))
        );
      } else if (pictureType === "profilePicture") {
        await updateUserProfilePicture(userId, filename);
        const updatedUser = { ...specificUser, profilePicture: filename };
        setSpecificUser(updatedUser);
        setUser(
          user.map((u) => (u._id === specificUser._id ? updatedUser : u))
        );
      }
    } catch (err) {
      console.log(`Error updating ${pictureType}`, err.message);
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

  useEffect(() => {
    console.log("setting isLoading to false");
    setIsLoading(false);
  }, [currentUser]);

  return (
    <>
      <TopNav />
      <div className="profile">
        <Sidebar />
        {specificUser && (
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileTopImgs">
                <div>
                  <img
                    className="profileCoverImg"
                    src={
                      specificUser.coverPicture
                        ? "/assets/" + specificUser.coverPicture
                        : "/assets/" + "user/default-cover.png"
                    }
                    alt="user cover"
                  />
                  {isCurrentUser && (
                    <AiOutlineEdit
                      className="coverEdit"
                      size={20}
                      onClick={handleClickCover}
                    />
                  )}
                  <input
                    type="file"
                    id="fileInputCoverPic"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handlePictureUpload(event, "coverPicture")
                    }
                  />
                </div>

                {isCurrentUser && (
                  <div className="logout">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}

                <div>
                  <ProfilePic user={specificUser} style={profileUserImg} />
                  {isCurrentUser && (
                    <AiOutlineEdit
                      className="profileEdit"
                      size={20}
                      onClick={handleClickProfile}
                    />
                  )}
                  <input
                    type="file"
                    id="fileInputProfilePic"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handlePictureUpload(event, "profilePicture")
                    }
                  />
                </div>
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
