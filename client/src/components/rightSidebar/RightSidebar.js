import React from "react";
import "./index.css";
import HomeSidebar from "./HomeSidebar";
import ProfileSidebar from "./ProfileSidebar";

export default function RightSidebar({ user }) {
  return (
    <div className="rightSidebar">
      <div className="rightSidebarWrapper">
        {user ? <ProfileSidebar user={user} /> : <HomeSidebar />}
      </div>
    </div>
  );
}
