import React, { useState } from "react";
import "./index.css";
import Axios from "axios";

export default function Comments({ postId, userId }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Axios.post(`/api/posts/${postId}/comments`, {
        body: JSON.stringify({
          postId: postId,
          text: commentText,
          userId: userId,
        }),
      });

      setCommentText("");
    } catch (error) {
      console.error(`Error at submitting comment: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Add a comment"
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      {comments.map((comment) => (
        <div key={comment._id}>
          <p>{comment.text}</p>
          <p>By: {comment.userId}</p>
          <p>At: {comment.createdAt}</p>
        </div>
      ))}
    </div>
  );
}
