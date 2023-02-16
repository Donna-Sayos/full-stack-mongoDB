import React, { useState, useRef } from "react";
import "../index.css";
import Axios from "axios";
import useFetchPosts from "../../../utils/customHooks/UseFetchPosts";
import Shares from "../../../common/share/Shares";
import Post from "../../../common/post/Post";

export default function AllFeeds({ currentUser }) {
  const [posts, setPosts] = useFetchPosts();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const desc = useRef();

  const createNewPost = async (newPost) => {
    try {
      await Axios.post("/api/v1/posts", newPost);
      const { data } = await Axios.get("/api/v1/posts/");
      setPosts(
        data.posts.sort(
          (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
        )
      );
      desc.current.value = null;
      setFile(null);
    } catch (err) {
      console.error("Error creating post: ", err.message);
      setError("Error creating post. Please try again later.");
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Shares
          file={file}
          setFile={setFile}
          desc={desc}
          currentUser={currentUser}
          error={error}
          setError={setError}
          createNewPost={createNewPost}
        />
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              posts={posts}
              setPosts={setPosts}
            />
          ))
        ) : (
          <p className="empty">Be the first to make a post!</p>
        )}
      </div>
    </div>
  );
}
