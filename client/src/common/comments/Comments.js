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

export default function Comments({
  postId,
  userId,
  commentsLength,
  handleCommentAdded,
}) {
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
        userId: userId,
        text: commentText,
      });

      setCommentText("");
      setNumComments(numComments + 1);
      setComments([...comments, response.data.comment]);
      handleCommentAdded();
    } catch (error) {
      console.error(`Error at submitting comment: ${error.message}`);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await Axios.delete(
        `/api/v1/posts/${postId}/comments/${commentId}`
      );
      if (response.data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setNumComments(numComments - 1);
      }
    } catch (error) {
      console.error(`Error at deleting comment: ${error.message}`);
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
      <h4 className="mb-3">{commentsLength} Comments</h4>
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
            const specificUser =
              comment?.userId &&
              allUsers.find((user) => user._id === comment.userId);
            const isUserComment = comment?.userId && comment.userId === userId; // Check if the comment belongs to the current user
            return (
              <div key={i} className="d-flex align-items-center mb-3">
                {specificUser?.profilePicture && (
                  <ProfilePic user={specificUser} style={commentsProfileImg} />
                )}
                <div>
                  <p className="mb-0">
                    <b>{specificUser?.username}</b>
                    {isUserComment && (
                      <button
                        className="removeComment ms-2"
                        onClick={() => handleCommentDelete(comment._id)}
                      >
                        X
                      </button>
                    )}
                  </p>
                  <p className="mb-0">{comment?.text}</p>
                  <small className="text-muted">
                    {format(comment?.createdAt)}
                  </small>
                </div>
              </div>
            );
          })}
        {commentsLength >= 3 && !showAllComments && (
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
