import React from "react";
import "./index.css";
import { useAuthContext } from "../../context/AuthProvider";
import Shares from "../share/Shares";
import FriendPosts from "./FriendPosts";

export default function FriendFeeds() {
  const { user: currentUser } = useAuthContext();

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Shares />
        {currentUser && currentUser.followings.length > 0 ? (
          currentUser.followings.map((uid, i) => (
            <FriendPosts key={i} userId={uid} />
          ))
        ) : (
          <p className="empty">Be the first to make a post!</p>
        )}
      </div>
    </div>
  );
}
