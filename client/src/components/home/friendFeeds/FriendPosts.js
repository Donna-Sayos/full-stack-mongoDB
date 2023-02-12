import React from "react";
import "../index.css";
import Post from "../../../common/post/Post";

export default function FriendPosts({ post, currentUser }) {
  return <div className="post">{post ? <Post post={post} /> : null}</div>;
}
