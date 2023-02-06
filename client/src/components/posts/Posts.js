import React, { useEffect, useState } from "react";
import "./index.css";
import { MdMoreVert } from "react-icons/md";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Posts({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [otherUser, setOtherUser] = useState({});
  const { user: currentUser } = useAuthContext();

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await Axios.get(`/api/v1/users?userId=${post.userId}`);
      setOtherUser(data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      Axios.put("/api/v1/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${otherUser.username}`}>
              <img
                className="postProfileImg"
                src={
                  otherUser.profilePicture
                    ? "/images/" + otherUser.profilePicture
                    : "/images/" + "avatar/default-user-photo.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{otherUser.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MdMoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="post" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={"/images/" + "others/thumbsup.png"}
              onClick={likeHandler}
              alt="like"
            />
            <img
              className="likeIcon"
              src={"/images/" + "others/heart.png"}
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
    </div>
  );
}
