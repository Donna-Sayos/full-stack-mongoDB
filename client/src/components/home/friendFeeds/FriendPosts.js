import React from "react";
import "../index.css";
import Post from "../../../common/post/Post";

export default function FriendPosts({ post, posts, setPosts }) {
  return <div className="post">{post ? <Post post={post} posts={posts} setPosts={setPosts} /> : null}</div>;
}
