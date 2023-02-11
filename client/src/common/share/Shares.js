import React from "react";
import "./index.css";
import {
  MdPermMedia,
  MdOutlineLabel,
  MdOutlineLocationOn,
  MdOutlineMood,
  MdOutlineCancel,
} from "react-icons/md";

export default function Shares({
  submitHandler,
  file,
  setFile,
  currentUser,
  desc,
  error,
}) {
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUser?.profilePicture
                ? "/assets/" + currentUser?.profilePicture
                : "/assets/" + "user/default-user-photo.png"
            }
            alt="user"
          />
          <input
            placeholder={`What's on your mind?`}
            className="shareInput"
            ref={desc}
          />
          {error && <p className="error">{error}</p>}
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
                name="uploadImg"
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
