import React from "react";
import "./index.css";
import Modal from "react-bootstrap/Modal";
import { format } from "timeago.js";
import Comments from "../../comments/Comments";
import { useAuthContext } from "../../../context/auth/AuthProvider";
import LikeButton from "../../post/LikeButton";

const heart = {
  width: "26px",
  height: "26px",
  marginRight: "8px",
};

export default function CommentsModal({
  show,
  handleClose,
  post,
  likers,
  specificUser,
}) {
  const { user: currentUser } = useAuthContext();

  return (
    <Modal show={show} onHide={handleClose} id="comments-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          Posted by <b>{specificUser.username}</b> {format(post.createdAt)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{post.desc}</p>
        {post.img && (
          <img className="postImg" src={"/assets/" + post.img} alt="post" />
        )}
        {post.video && (
          <video className="postVid" controls src={"/assets/" + post.video}>
            Your browser does not support the video tag.
          </video>
        )}
        <hr className="modal-Hr" />
        <Comments postId={post._id} userId={currentUser._id} />
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex flex-row justify-content-start align-items-center">
            <LikeButton style={heart} />
            <span className="likes m-0">{likers && likers.length} likes</span>
          </div>
          <div className="d-flex justify-content-end">
            <span className="m-0">{post.comments.length} comments</span>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
