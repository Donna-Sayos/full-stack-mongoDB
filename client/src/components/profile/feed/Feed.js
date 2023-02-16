import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import Axios from "axios";
import { shortUuid } from "../../../utils/helper/helperFunctions";
import Post from "../../../common/post/Post";
import Shares from "../../../common/share/Shares";

export default function Feed({ username, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const desc = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (!desc.current.value && !file) {
      return;
    }

    const newPost = {
      userId: currentUser?._id,
      desc: desc.current.value,
    };

    if (file) {
      if (file.type.startsWith("image")) {
        if (file.size > 10000000) {
          // 10 MB
          setError("File size is too large, max 10 MB allowed");
          return;
        }

        const data = new FormData();
        const fileName = shortUuid() + file.name;
        data.append("name", fileName);
        data.append("uploadFile", file);
        newPost.img = fileName;

        try {
          await Axios.post("/api/v1/upload", data);
        } catch (err) {
          console.error("Error uploading file: ", err.message);
          setError("Error uploading file. Please try again later.");
          return;
        }
      } else if (file.type.startsWith("video")) {
        if (file.size > 10000000) {
          // 10 MB
          setError("File size is too large, max 10 MB allowed");
          return;
        }

        const data = new FormData();
        const fileName = shortUuid() + file.name;
        data.append("name", fileName);
        data.append("uploadFile", file);
        newPost.video = fileName;

        try {
          await Axios.post("/api/v1/upload", data);
        } catch (err) {
          console.error("Error uploading file: ", err.message);
          setError("Error uploading file. Please try again later.");
          return;
        }
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
            submitHandler={submitHandler}
            file={file}
            setFile={setFile}
            desc={desc}
            currentUser={currentUser}
            error={error}
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
          <p className="empty">Don't be shy. Make a post!</p>
        )}
      </div>
    </div>
  );
}
