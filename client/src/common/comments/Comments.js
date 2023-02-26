import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { format } from "timeago.js";
import useFetchUsers from "../../utils/customHooks/UseFetchUsers";
import ProfilePic from "../pic/ProfilePic";

const commentsProfileImg = {
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  objectFit: "cover",
  cursor: "pointer",
};

export default function Comments({ postId, userId, handleCommentAdded }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [numComments, setNumComments] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);

  const allUsers = useFetchUsers();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post(`/api/v1/posts/${postId}/comments`, {
        postId: postId,
        text: commentText,
        userId: userId,
      });

      setCommentText("");
      setNumComments(numComments + 1);
      setComments([...comments, response.data.comment]);
      handleCommentAdded();
    } catch (error) {
      console.error(`Error at submitting comment: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await Axios.get(`/api/v1/posts/${postId}/comments`);
        setComments(response.data.comments);
        setNumComments(response.data.comments.length);
      } catch (error) {
        console.error(`Error at fetching comments: ${error.message}`);
      }
    };

    fetchComments();
  }, [postId, numComments]);

  const displayComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className="mt-3">
      <h4 className="mb-3">{comments.length} Comments</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Add a comment"
            className="form-control"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className="comments-container mt-3">
        {displayComments &&
          displayComments.map((comment, i) => {
            const specificUser = allUsers.find(
              (user) => user._id === comment.userId
            );
            return (
              <div key={i} className="d-flex align-items-center mb-3">
                <ProfilePic
                  user={specificUser}
                  style={{ ...commentsProfileImg, marginRight: "10px" }}
                />
                <div>
                  <p className="mb-0">
                    <b>{specificUser?.username}</b>
                  </p>
                  <p className="mb-0">{comment.text}</p>
                  <small className="text-muted">
                    {format(comment.createdAt)}
                  </small>
                </div>
              </div>
            );
          })}
        {comments.length > 2 && !showAllComments && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowAllComments(true)}
            >
              Show more comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
