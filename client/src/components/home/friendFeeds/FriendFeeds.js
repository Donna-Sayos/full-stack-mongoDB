import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import Axios from "axios";
import Shares from "../../../common/share/Shares";
import FriendPosts from "./FriendPosts";

export default function FriendFeeds({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const desc = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    const newPost = {
      userId: currentUser?._id,
      desc: desc.current.value,
    };

    if (file) {
      if (file.size > 10000000) {
        // 10 MB
        setError("File size is too large, max 10 MB allowed");
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
        setError("Error uploading file. Please try again later.");
        return;
      }
    }

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

  console.log("Posts from FriendFeeds: ", posts);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Shares
          submitHandler={submitHandler}
          file={file}
          setFile={setFile}
          desc={desc}
          currentUser={currentUser}
          error={error}
        />
        {currentUser ? (
          currentUser.followings.length > 0 ? (
            currentUser.followings
              .map((uid, i) => (
                <FriendPosts
                  key={i}
                  userId={uid}
                  currentUser={currentUser}
                  posts={posts}
                />
              ))
              .filter((p) => p)
          ) : (
            <FriendPosts
              userId={currentUser._id}
              currentUser={currentUser}
              posts={posts}
            />
          )
        ) : null}
        {currentUser &&
          posts.filter(
            (p) =>
              p.userId === currentUser._id ||
              currentUser.followings.includes(p.userId)
          ).length === 0 && (
            <p className="empty">Be the first to make a post!</p>
          )}
      </div>
    </div>
  );
}
