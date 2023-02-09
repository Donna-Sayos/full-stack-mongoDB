import React from "react";
import "./index.css";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import AllFeeds from "../allFeeds/AllFeeds";
import FriendFeeds from "../friendFeeds/FriendFeeds";
import RightSidebar from "../rightSidebar/RightSidebar";

export default function Home() {
  return (
    <>
      <TopNav />
      <div className="homeContainer">
        <Sidebar />
        {/* <AllFeeds /> */}
        <FriendFeeds />
        <RightSidebar />
      </div>
    </>
  );
}
