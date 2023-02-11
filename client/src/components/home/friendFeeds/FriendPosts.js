import React from "react";
import "../index.css";
import Post from "../../../common/Post";

export default function FriendPosts({ userId, currentUser, posts }) {
  const friendAndCurrentUserPost =
    currentUser && posts
      ? posts.filter((p) => p.userId === userId || p.userId === currentUser._id)
      : [];

  return (
    <div className="feed">
      <div className="feedWrapper">
        {friendAndCurrentUserPost && friendAndCurrentUserPost.length > 0
          ? friendAndCurrentUserPost.map((p) => <Post key={p._id} post={p} />)
          : null}
      </div>
    </div>
  );
}
