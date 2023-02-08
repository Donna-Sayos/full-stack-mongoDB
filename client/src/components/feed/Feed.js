import React, { useState, useEffect } from "react";
import "./index.css";
import Posts from "../posts/Posts";
import Shares from "../share/Shares";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = username
        ? await Axios.get("/api/v1/posts/profile/" + username)
        : await Axios.get("/api/v1/posts/timeline/" + user._id);
      setPosts(
        data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };

    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Shares />}
        {posts.map((post) => (
          <Posts key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
