import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";
import Shares from "../share/Shares";
import FriendPosts from "./FriendPosts";

export default function FriendFeeds() {
    const [posts, setPosts] = useState([]);
    const { user: currentUser } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await Axios.get("/api/v1/posts/");
      setPosts(
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
        <Shares />
        {currentUser && currentUser.followings.length > 0 ? (
          currentUser.followings.map((uid, i) => (
            <FriendPosts key={i} userId={uid} currentUser={currentUser} posts={posts}/>
          ))
        ) : (
          <p className="empty">Be the first to make a post!</p>
        )}
      </div>
    </div>
  );
}
