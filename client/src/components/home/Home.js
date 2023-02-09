import React, { useState } from "react";
import "./index.css";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import AllFeeds from "../allFeeds/AllFeeds";
import FriendFeeds from "../friendFeeds/FriendFeeds";
import RightSidebar from "../rightSidebar/RightSidebar";

export default function Home() {
  const [displayFeed, setDisplayFeed] = useState("friendFeeds");

  return (
    <>
      <TopNav setDisplayFeed={setDisplayFeed} />
      <div className="homeContainer">
        <Sidebar />
        {displayFeed === "allFeeds" ? <AllFeeds /> : <FriendFeeds />}
        <RightSidebar />
      </div>
    </>
  );
}
