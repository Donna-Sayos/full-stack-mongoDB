import React, { useState, useEffect } from "react";
import "./index.css";
import HomeSidebar from "./HomeSidebar";
import ProfileSidebar from "./ProfileSidebar";

export default function RightSidebar({ user }) {
  return (
    <div className="rightSidebar">
      <div className="rightSidebarWrapper">
        {user ? <ProfileSidebar user={user} /> : <HomeSidebar user={user} />}
      </div>
    </div>
  );
}
