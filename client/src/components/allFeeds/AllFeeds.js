import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import Shares from "../share/Shares";
import AllPosts from "./AllPosts";

export default function AllFeeds() {
  const [allPosts, setAllPosts] = useState([]);

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

  console.log("allPosts: ", allPosts)

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Shares />
        {allPosts && allPosts.length > 0 ? (
          allPosts.map((post) => (
            <AllPosts key={post._id} post={post} />
          ))
        ) : (
          <p className="empty">Be the first to make a post!</p>
        )}
      </div>
    </div>
  );
}
