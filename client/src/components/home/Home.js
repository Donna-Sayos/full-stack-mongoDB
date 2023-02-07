import React from "react";
import "./index.css";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";
import Feed from "../feed/Feed";
import RightSidebar from "../rightSidebar/RightSidebar";

export default function Home() {
  return (
    <>
      <TopNav />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <RightSidebar />
      </div>
    </>
  );
}
