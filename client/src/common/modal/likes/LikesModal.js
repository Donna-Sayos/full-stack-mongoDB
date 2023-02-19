import React, { useState } from "react";
import "./index.css";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProfilePic from "../../pic/ProfilePic";
import LikeButton from "../../post/LikeButton";

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
  const [isLoading, setIsLoading] = useState(false);
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
            const followed =
              currentUser &&
              currentUser.followings &&
              currentUser.followings.includes(user?._id);

            const handleClick = async () => {
              setIsLoading(true);
              try {
                if (!followed) {
                  await Axios.put(`/api/v1/users/${user?._id}/follow`, {
                    userId: currentUser._id,
                  });
                  dispatch({ type: "FOLLOW", payload: user?._id });
                }
              } catch (err) {
                console.error("Error at following in LikesModal. ", err);
              }
              setIsLoading(false);
            };

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
                    {!followed ? (
                      <Button variant="primary" onClick={handleClick}>
                        {isLoading ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <span>follow +</span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="info"
                        onClick={() =>
                          console.log("you messaged ", user?.username)
                        }
                      >
                        message
                      </Button>
                    )}
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
