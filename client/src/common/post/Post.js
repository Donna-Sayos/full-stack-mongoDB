import React, { useState, useEffect } from "react";
import "./index.css";
import { useAuthContext } from "../../context/auth/AuthProvider";
import useFetchUsers from "../../utils/customHooks/UseFetchUsers";
import Axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import LikesModal from "../modal/likes/LikesModal";

export default function Post({ post, posts, setPosts }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  const specificUser = user ? user.find((u) => u._id === post.userId) : null;
  const { user: currentUser } = useAuthContext();

  const allUsers = useFetchUsers();

  const lu = post.likes.map((userId) =>
    allUsers.find((user) => user._id === userId)
  );

  const likeHandler = async () => {
    try {
      await Axios.put("/api/v1/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
      setPosts((prevPosts) =>
        prevPosts.map((prevPost) => {
          if (prevPost._id === post._id) {
            return {
              ...prevPost,
              likes: isLiked
                ? prevPost.likes.filter((id) => id !== currentUser._id)
                : [...prevPost.likes, currentUser._id],
            };
          }
          return prevPost;
        })
      );
    } catch (err) {
      console.error("Error liking post: ", err.message);
    }
  };

  const deleteHandler = async (postId, postUserId) => {
    try {
      if (postUserId !== currentUser._id) {
        return;
      } else {
        await Axios.delete(`/api/v1/posts/${postId}`, {
          data: { userId: postUserId },
        });

        const updatedPosts = posts.filter((p) => p._id !== postId);
        setPosts(updatedPosts);
      }
    } catch (err) {
      console.error("Error deleting post: ", err.message);
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchUser = async () => {
      const { data } = await Axios.get(`/api/v1/users?userId=${post.userId}`);

      if (isSubscribed) {
        setUser(data);
      }
    };
    fetchUser();

    return () => (isSubscribed = false);
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
            {currentUser._id === post.userId && (
              <div className="postTopRight">
                <button
                  className="dots"
                  data-toggle="modal"
                  data-target=".dotModal"
                  onClick={() => deleteHandler(post._id, post.userId)}
                >
                  x
                </button>
              </div>
            )}
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
              <button
                className="postLikeCounter"
                data-toggle="modal"
                data-target="#likesModal"
              >
                {lu.length === 1 ? (
                  <span>{lu[0]?.username} likes this</span>
                ) : lu.length > 1 ? (
                  <span>
                    {lu[0]?.username} and {lu.length - 1} others like this
                  </span>
                ) : (
                  <span>Be the first to like this</span>
                )}
              </button>
            </div>
            <div className="postBottomRight">
              <button
                className="postCommentText"
                onClick={() => console.log("comments clicked...")}
              >
                {post.comment} comments
              </button>
            </div>
          </div>
          <LikesModal likesArr={lu} />
        </div>
      )}
    </div>
  );
}
