import React from "react";
import "./index.css";
import Axios from "axios";
import {
  MdPermMedia,
  MdOutlineLabel,
  MdOutlineLocationOn,
  MdOutlineMood,
  MdOutlineCancel,
} from "react-icons/md";
import { shortUuid } from "../../utils/helper/helperFunctions";
import ProfilePic from "../pic/ProfilePic";

const shareProfileImg = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px",
};

export default function Shares({
  currentUser,
  error,
  setError,
  createNewPost,
  desc,
  file,
  setFile,
}) {
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (!desc.current.value && !file) {
      return;
    }

    const newPost = {
      userId: currentUser?._id,
      desc: desc.current.value,
    };

    if (file) {
      if (file.type.startsWith("image")) {
        if (file.size > 10000000) {
          // 10 MB
          setError("File size is too large, max 10 MB allowed");
          return;
        }

        const data = new FormData();
        const fileName = shortUuid() + file.name;
        data.append("name", fileName);
        data.append("uploadFile", file);
        newPost.img = fileName;

        try {
          await Axios.post("/api/v1/upload", data);
        } catch (err) {
          console.error("Error uploading file: ", err.message);
          setError("Error uploading file. Please try again later.");
          return;
        }
      } else if (file.type.startsWith("video")) {
        if (file.size > 10000000) {
          // 10 MB
          setError("File size is too large, max 10 MB allowed");
          return;
        }

        const data = new FormData();
        const fileName = shortUuid() + file.name;
        data.append("name", fileName);
        data.append("uploadFile", file);
        newPost.video = fileName;

        try {
          await Axios.post("/api/v1/upload", data);
        } catch (err) {
          console.error("Error uploading file: ", err.message);
          setError("Error uploading file. Please try again later.");
          return;
        }
      }
    }

    await createNewPost(newPost);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <ProfilePic style={shareProfileImg} user={currentUser} />
          <input
            placeholder={`What's on your mind?`}
            className="shareInput"
            ref={desc}
            maxLength="500"
          />
          {error && <p className="error">{error}</p>}
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            {file.type.startsWith("image/") ? (
              <img
                className="shareImg"
                src={URL.createObjectURL(file)}
                alt="file"
              />
            ) : (
              <video className="shareVideo" controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the video tag.
              </video>
            )}
            <MdOutlineCancel
              className="shareCancelImg"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <MdPermMedia color="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name="uploadFile"
                accept=".png, .jpeg, .jpg, .mp4, .webm, .avi, .mov, .wmv, .flv, .mkv, .3gp, .gif"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <MdOutlineLabel color="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <MdOutlineLocationOn color="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <MdOutlineMood color="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareBtn" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
