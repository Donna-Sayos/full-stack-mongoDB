import React, { useState, useRef } from "react";
import "./index.css";
import {
  MdPermMedia,
  MdOutlineLabel,
  MdOutlineLocationOn,
  MdOutlineMood,
  MdOutlineCancel,
} from "react-icons/md";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";

export default function Shares() {
  const [file, setFile] = useState(null);
  const desc = useRef();
  const { user } = useAuthContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log("newPost: ", newPost)
      try {
        // await Axios.post("/api/v1/upload", data);
        const response = await Axios.post("/api/v1/upload", data);
        console.log("response: ", response)
      } catch (err) {
        console.error("Error uploading file: ", err.message);
      }
    }
    try {
      console.log("newPost: ", newPost)
      await Axios.post("/api/v1/posts", newPost);
      // window.location.reload();
    } catch (err) {
      console.error("Error creating post: ", err.message);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? "/images/" + user.profilePicture
                : "/images/" + "avatar/default-user-photo.png"
            }
            alt="user"
          />
          <input
            placeholder={`What's on your mind?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img
              className="shareImg"
              src={URL.createObjectURL(file)}
              alt="file"
            />
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
                accept=".png,.jpeg,.jpg"
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
