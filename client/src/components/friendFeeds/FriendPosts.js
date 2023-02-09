import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import SinglePost from "./SinglePost";

export default function FriendPosts({ userId }) {
  const [allPosts, setAllPosts] = useState([]);
  const friendPost = allPosts.filter((p) => p.userId === userId);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await Axios.get("/api/v1/posts/");
      setAllPosts(
        data.posts.sort(
          (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
        )
      );
    };

    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {friendPost && friendPost.length > 0 ? (
          friendPost.map((p) => <SinglePost key={p._id} post={p} />)
        ) : null}
      </div>
    </div>
  );
}
