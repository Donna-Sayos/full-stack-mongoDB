import React from "react";
import "./index.css";
import Modal from "react-bootstrap/Modal";
import { format } from "timeago.js";

export default function CommentsModal({
  show,
  handleClose,
  post,
  likers,
  specificUser,
}) {
  return (
    <Modal show={show} onHide={handleClose} id="comments-modal">
      <Modal.Header closeButton>
        <Modal.Title>{post.desc}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Posted by {specificUser.username} on {format(post.createdAt)}
        </p>
        {post.img && <img src={"/assets/" + post.img} alt="post" />}
        {post.video && (
          <video controls src={"/assets/" + post.video}>
            Your browser does not support the video tag.
          </video>
        )}
      </Modal.Body>
      <Modal.Footer>
        <p>{likers && likers.length} likes</p>
        <p>{post.comment} comments</p>
      </Modal.Footer>
    </Modal>
  );
}
