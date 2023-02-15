import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import Axios from "axios";
import { shortUuid } from "../../../utils/helper/helperFunctions";
import Shares from "../../../common/share/Shares";
import Post from "../../../common/post/Post";

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

  const deleteHandler = async (postId, postUserId) => {
    try {
      if (postUserId !== currentUser._id) {
        throw new Error("You can only delete your own posts");
      } else {
        await Axios.delete("/api/v1/posts/" + postId, {
          data: { userId: postUserId },
        });

        setPosts(posts.filter((p) => p._id !== postId));
      }
    } catch (err) {
      console.error("Error deleting post: ", err.message);
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
        {currentUser &&
        posts.filter(
          (p) =>
            p.userId === currentUser._id ||
            (currentUser.followings &&
              currentUser.followings.includes(p.userId))
        ).length > 0 ? (
          posts
            .filter(
              (p) =>
                p.userId === currentUser._id ||
                (currentUser.followings &&
                  currentUser.followings.includes(p.userId))
            )
            .map((post) => (
              <Post
                key={post._id}
                post={post}
                deleteHandler={() => deleteHandler(post._id, post.userId)}
              />
            ))
        ) : (
          <p className="empty">Be the first to make a post!</p>
        )}
      </div>
    </div>
  );
}
