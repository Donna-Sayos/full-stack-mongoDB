import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import Post from "../../../common/post/Post";
import Shares from "../../../common/share/Shares";
import Axios from "axios";
// import { useAuthContext } from "../../../context/AuthProvider";

export default function Feed({ username, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const desc = useRef();
  // const { user } = useAuthContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: currentUser?._id,
      desc: desc.current.value,
    };
    if (file) {
      if (file.size > 10000000) {
        // 10 MB
        console.error("File size is too large, max 10 MB allowed");
        return;
      }
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("uploadImg", file);
      newPost.img = fileName;
      try {
        await Axios.post("/api/v1/upload", data);
      } catch (err) {
        console.error("Error uploading file: ", err.message);
      }
    }
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
    } catch (err) {
      console.error("Error creating post: ", err.message);
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
            submitHandler={submitHandler}
            file={file}
            setFile={setFile}
            desc={desc}
            currentUser={currentUser}
          />
        )}
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p className="empty">Don't be shy. Make a post!</p>
        )}
      </div>
    </div>
  );
}
