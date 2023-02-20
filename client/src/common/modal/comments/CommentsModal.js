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
      </Modal.Body>
      <Modal.Footer>
        <p>{likers && likers.length} likes</p>
        <p>{post.comment} comments</p>
      </Modal.Footer>
    </Modal>
  );
}
