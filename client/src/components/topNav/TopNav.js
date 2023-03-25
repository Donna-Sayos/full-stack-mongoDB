import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import { BiSearchAlt2, BiUserPin } from "react-icons/bi";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { useOnlineContext } from "../../context/online/OnlineContextProvider";
import ProfilePic from "../../common/pic/ProfilePic";
import { io } from "socket.io-client";

const topNavImg = {
  width: "32px",
  height: "32px",
  objectFit: "cover",
  borderRadius: "50%",
  cursor: "pointer",
};

export default function TopNav({ setDisplayFeed }) {
  const socket = useRef(null);
  const { user: currentUser } = useAuthContext();
  const { userNotif, clearUserNotif, notifications } = useOnlineContext();
  const count = notifications[currentUser._id]?.userNotifications;

  const handleUserNotif = () => { //FIXME: this is not working
    socket.current = io("http://localhost:5001");
    socket.current.emit("resetNotification", { receiverId });
  };

  const handleFeed = () => {
    setDisplayFeed("friendFeeds");
  };

  const handleExplore = () => {
    setDisplayFeed("allFeeds");
  };

  console.log("notification count", count);

  return (
    <div className="topNavContainer">
      <div className="topNavLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">JustBeYou</span>
        </Link>
      </div>
      <div className="topNavCenter">
        <div className="searchbar">
          <BiSearchAlt2 className="searchIcon" />
          <input placeholder="Search" className="searchInput" />
        </div>
      </div>
      <div className="topNavRight">
        <div className="topNavLinks">
          <Link to="/?feed" className="navLink" onClick={handleFeed}>
            <span className="topNavLink">Feed</span>
          </Link>
          <Link to="/?explore" className="navLink" onClick={handleExplore}>
            <span className="topNavLink">Explore</span>
          </Link>
        </div>
        <div className="topNavIcons">
          <div className="topNavIconItem">
            <BiUserPin size={25} />
            {/* <span className="topNavIconBadge">1</span> */}
          </div>
          <div className="topNavIconItem" onClick={handleUserNotif}>
            <Link to="/messenger">
              <BsFillChatLeftTextFill size={18} color="white" />
              {count > 0 && <span className="topNavIconBadge"></span>}
            </Link>
          </div>
          <div className="topNavIconItem">
            <BsFillBellFill size={18} />
            {/* <span className="topNavIconBadge">1</span> */}
          </div>
        </div>
        <Link to={`/profile/${currentUser.username}`}>
          <ProfilePic user={currentUser} style={topNavImg} />
        </Link>
      </div>
    </div>
  );
}
