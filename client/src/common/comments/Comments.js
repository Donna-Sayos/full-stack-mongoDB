import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { format } from "timeago.js";

export default function Comments({ postId, userId }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Axios.post(`/api/v1/posts/${postId}/comments`, {
        postId: postId,
        text: commentText,
        userId: userId,
      });

      setCommentText("");
    } catch (error) {
      console.error(`Error at submitting comment: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await Axios.get(`/api/v1/posts/${postId}/comments`);

        if (response.data.comments.length < 1) console.log("No comments");
        setComments(response.data.comments);
      } catch (error) {
        console.error(`Error at fetching comments: ${error.message}`);
      }
    };

    fetchComments();
  }, [postId]);

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
      {comments &&
        comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.text}</p>
            <p>By: {comment.userId}</p>
            <p>{format(comment.createdAt)}</p>
          </div>
        ))}
    </div>
  );
}
