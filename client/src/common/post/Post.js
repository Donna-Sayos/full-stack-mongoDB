import React, { useState, useEffect } from "react";
import "./index.css";
import { useAuthContext } from "../../context/auth/AuthProvider";
import Axios from "axios";
import { MdMoreVert } from "react-icons/md";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import DotsModal from "../modal/dots/DotsModal";

export default function Post({ post, posts, setPosts }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const specificUser = user ? user.find((u) => u._id === post.userId) : null;
  const { user: currentUser } = useAuthContext();

  const deleteHandler = async (postId) => {
    try {
      await Axios.delete(`/api/v1/posts/${postId}`, {
        data: { userId: currentUser._id },
      });
      console.log(`deleting post ${postId} ..`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post: ", err.message);
    }
  };

  const likeHandler = () => {
    try {
      Axios.put("/api/v1/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await Axios.get(`/api/v1/users?userId=${post.userId}`);
      setUser(data);
    };
    fetchUser();
  }, [post.userId]);

  return (
    <div className="post">
      {specificUser && (
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <Link to={`/profile/${specificUser.username}`}>
                <img
                  className="postProfileImg"
                  src={
                    specificUser.profilePicture
                      ? "/assets/" + specificUser.profilePicture
                      : "/assets/" + "user/default-user-photo.png"
                  }
                  alt="user"
                />
              </Link>
              <span className="post-Username">{specificUser.username}</span>
              <span className="postDate">{format(post.createdAt)}</span>
            </div>
            <div className="postTopRight">
              <button
                className="dots"
                data-toggle="modal"
                data-target=".dotModal"
              >
                <MdMoreVert size={24} />
              </button>
              <DotsModal postId={post._id} deleteHandler={deleteHandler} />
            </div>
          </div>
          <div className="postCenter">
            <div className="postText">
              <span>{post?.desc}</span>
            </div>
            {post.img && (
              <div>
                <hr className="share-Hr" />
                <img
                  className="postImg"
                  src={"/assets/" + post.img}
                  alt="post"
                />
              </div>
            )}
            {post.video && (
              <div>
                <hr className="share-Hr" />
                <video
                  className="postVid"
                  controls
                  src={"/assets/" + post.video}
                />
              </div>
            )}
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <img
                className="likeIcon"
                src={"/assets/" + "others/heart.png"}
                onClick={likeHandler}
                alt="heart"
              />
              <span className="postLikeCounter">{like} people like it</span>
            </div>
            <div className="postBottomRight">
              <span className="postCommentText">{post.comment} comments</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
