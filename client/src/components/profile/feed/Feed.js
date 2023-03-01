import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import Axios from "axios";
import Post from "../../../common/post/Post";
import Shares from "../../../common/share/Shares";

export default function Feed({ username, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const desc = useRef();

  const createNewPost = async (newPost) => {
    try {
      await Axios.post("/api/v1/posts", newPost);
      const { data } = username
        ? await Axios.get("/api/v1/posts/profile/" + username)
        : await Axios.get("/api/v1/posts/timeline/" + currentUser?._id);
      setPosts(
        data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
      desc.current.value = null;
      setFile(null);
    } catch (err) {
      console.error("Error creating post: ", err.message);
      setError("Error creating post. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = username
        ? await Axios.get("/api/v1/posts/profile/" + username)
        : await Axios.get("/api/v1/posts/timeline/" + currentUser?._id);
      setPosts(
        data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };

    fetchPosts();
  }, [username, currentUser?._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === currentUser?.username) && (
          <Shares
            currentUser={currentUser}
            error={error}
            setError={setError}
            createNewPost={createNewPost}
            desc={desc}
            file={file}
            setFile={setFile}
          />
        )}
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              posts={posts}
              setPosts={setPosts}
            />
          ))
        ) : (
          <p className="empty">No Post.</p>
        )}
      </div>
    </div>
  );
}
