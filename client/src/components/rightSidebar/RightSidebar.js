import React, { useState, useEffect } from "react";
import "./index.css";
import HomeSidebar from "./HomeSidebar";
import ProfileSidebar from "./ProfileSidebar";

export default function RightSidebar({ specificUser }) {
  return (
    <div className="rightSidebar">
      <div className="rightSidebarWrapper">
        {specificUser ? (
          <ProfileSidebar
            specificUser={specificUser}
          />
        ) : (
          <HomeSidebar />
        )}
      </div>
    </div>
  );
}
