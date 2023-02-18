import React from "react";
import "./index.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProfilePic from "../../pic/ProfilePic";

export default function LikesModal({ likers, show, handleClose }) {
  if (likers.length === 0) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              className="heart"
              src={"/assets/" + "others/heart.png"}
              alt="heart"
            />
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
          <img
            className="heart"
            src={"/assets/" + "others/heart.png"}
            alt="heart"
          />
          <span className="likesNum">{likers.length} likes</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="likesContainer">
        {likers &&
          likers.map((user, index) => (
            <div
              key={index}
              onClick={() => console.log(`${user?.username} clicked...`)}
            >
              <ProfilePic className="profileImg" user={user} />
              <span className="name">{user?.username}</span>
              {index !== likers.length - 1 && <hr className="likesHr" />}
            </div>
          ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
