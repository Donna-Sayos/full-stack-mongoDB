import React, { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProfilePic from "../../pic/ProfilePic";
import LikeButton from "../../post/LikeButton";
import FollowButton from "./FollowButton";

const profileImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px",
};

const heart = {
  width: "30px",
  height: "30px",
  marginRight: "8px",
};

export default function LikesModal({ likers, show, handleClose }) {
  const { user: currentUser, dispatch } = useAuthContext();

  if (likers.length === 0) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <LikeButton style={heart} />
            <span className="likesNum">0</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">No likes yet.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <LikeButton style={heart} />
          <span className="likesNum">{likers.length} likes</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="likesContainer">
        {likers &&
          likers.map((user, index) => {
            if (currentUser?._id === user?._id) {
              // skip if the user is the currentUser
              return (
                <div key={index}>
                  <div className="row align-items-center">
                    <div className="col">
                      <Link to={`/profile/${user?.username}`}>
                        <ProfilePic style={profileImg} user={user} />
                        <span className="name">{user?.username}</span>
                      </Link>
                    </div>
                  </div>
                  {index !== likers.length - 1 && <hr className="likesHr" />}
                </div>
              );
            }

            return (
              <div key={index}>
                <div className="row align-items-center">
                  <div className="col">
                    <Link to={`/profile/${user?.username}`}>
                      <ProfilePic style={profileImg} user={user} />
                      <span className="name">{user?.username}</span>
                    </Link>
                  </div>
                  <div className="col text-end">
                    <FollowButton
                      user={user}
                      currentUser={currentUser}
                      dispatch={dispatch}
                    />
                  </div>
                </div>
                {index !== likers.length - 1 && <hr className="likesHr" />}
              </div>
            );
          })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
