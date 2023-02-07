import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";
import Friends from "../friends/Friends";
import {
  MdRssFeed,
  MdOutlineChat,
  MdPlayCircleOutline,
  MdGroups,
  MdOutlineBookmark,
  MdOutlineLiveHelp,
  MdOutlineWorkOutline,
  MdSchool,
  MdEvent,
} from "react-icons/md";

export default function Sidebar() {
  const [otherUsers, setOtherUsers] = useState([]);
  const { user } = useAuthContext();

  async function getUsers() {
    const { data } = await Axios.get("/api/v1/users");
    setOtherUsers(data.filter((u) => u._id !== user._id));
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <MdRssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineChat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <MdPlayCircleOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <MdGroups className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineBookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineLiveHelp className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineWorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <MdEvent className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <MdSchool className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {otherUsers.map((u) => (
            <Friends key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
