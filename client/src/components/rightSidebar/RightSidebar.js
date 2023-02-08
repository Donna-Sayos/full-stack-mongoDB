import React, { useState, useEffect } from "react";
import "./index.css";
import HomeSidebar from "./HomeSidebar";
import ProfileSidebar from "./ProfileSidebar";

export default function RightSidebar({ user, specificUser }) {
  return (
    <div className="rightSidebar">
      <div className="rightSidebarWrapper">
        {user ? <ProfileSidebar user={user} specificUser={specificUser} /> : <HomeSidebar user={user} />}
      </div>
    </div>
  );
}
