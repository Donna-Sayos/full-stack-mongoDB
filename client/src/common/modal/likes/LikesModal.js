import React from "react";
import "./index.css";
import { FaRegTimesCircle } from "react-icons/fa";

export default function LikesModal({ likesArr = [] }) {
  if (!likesArr || likesArr.length === 0) {
    return (
      <div
        className="modal fade"
        id="likesModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="likesModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="head modal-header">
              <div className="d-flex align-items-center justify-content-start">
                <img
                  className="heart"
                  src={"/assets/" + "others/heart.png"}
                  alt="heart"
                />
                <span className="likesNum">0</span>
              </div>
              <div className="d-flex justify-content-end">
                <button className="cancel" data-dismiss="modal">
                  <FaRegTimesCircle size={22} />
                </button>
              </div>
            </div>
            <div className="modal-body">No likes yet.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal fade"
      id="likesModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="likesModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="head modal-header">
            <div className="d-flex align-items-center justify-content-start">
              <img
                className="heart"
                src={"/assets/" + "others/heart.png"}
                alt="heart"
              />
              {likesArr && likesArr.length > 0 ? (
                <span className="likesNum">{likesArr.length}</span>
              ) : null}
            </div>
            <div className="d-flex justify-content-end">
              <button className="cancel" data-dismiss="modal">
                <FaRegTimesCircle size={22} />
              </button>
            </div>
          </div>
          {likesArr &&
            likesArr.map((u, index) => (
              <div className="likers modal-body" key={index}>
                <img
                  className="profileImg"
                  src={
                    u?.profilePicture
                      ? "/assets/" + u.profilePicture
                      : "/assets/" + "user/default-user-photo.png"
                  }
                  alt="user"
                />
                <span className="name">
                  {u?.firstName} {u?.lastName}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
