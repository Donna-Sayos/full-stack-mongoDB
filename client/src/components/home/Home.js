import React, { useState } from "react";
import "./index.css";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import AllFeeds from "../allFeeds/AllFeeds";
import FriendFeeds from "../friendFeeds/FriendFeeds";
import RightSidebar from "../rightSidebar/RightSidebar";

export default function Home() {
  const [showAllFeeds, setShowAllFeeds] = useState(true);

  const toggleShowAllFeeds = () => setShowAllFeeds(!showAllFeeds);

  return (
    <>
      <TopNav toggleShowAllFeeds={toggleShowAllFeeds} />
      <div className="homeContainer">
        <Sidebar />
        {showAllFeeds ? <FriendFeeds /> : <AllFeeds />}
        <RightSidebar />
      </div>
    </>
  );
}
