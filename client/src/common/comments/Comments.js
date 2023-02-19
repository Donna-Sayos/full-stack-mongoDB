import React, { useState } from "react";
import "./index.css";

export default function Comments({ postId }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      });
      const comment = await response.json();
      setComments([...comments, comment]);
      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
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
