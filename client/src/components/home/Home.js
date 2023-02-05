import React from "react";
import "./index.css";
import TopNav from "../topNav/TopNav";
import Sidebar from "../sidebar/Sidebar";

export default function Home() {
  return (
    <>
      <TopNav />
      <div className="homeContainer">
        <Sidebar />
      </div>
    </>
  );
}
