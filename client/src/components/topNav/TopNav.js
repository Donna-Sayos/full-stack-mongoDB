import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import { BiSearchAlt2, BiUserPin } from "react-icons/bi";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { useOnlineContext } from "../../context/online/OnlineContextProvider";
import { markAsUnread } from "../../utils/helper/helperFunctions"; // FIXME: testing feature
import ProfilePic from "../../common/pic/ProfilePic";

const topNavImg = {
  width: "32px",
  height: "32px",
  objectFit: "cover",
  borderRadius: "50%",
  cursor: "pointer",
};

export default function TopNav({ setDisplayFeed }) {
  const { user: currentUser } = useAuthContext();
  const { notifications, resetIsReadingHandler, readingChat } =
    useOnlineContext(); // FIXME: testing feature
  const notif = notifications[currentUser._id]?.userNotifications;

  const handleFeed = () => {
    setDisplayFeed("friendFeeds");
    markAsUnread(currentUser._id); // FIXME: testing feature
  };

  const handleExplore = () => {
    setDisplayFeed("allFeeds");
    markAsUnread(currentUser._id); // FIXME: testing feature
  };

  return (
    <div className="topNavContainer">
      <div
        className="topNavLeft"
        onClick={() => markAsUnread(currentUser._id)} // FIXME: testing feature
      >
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
          <div className="topNavIconItem">
            <Link to="/messenger">
              <BsFillChatLeftTextFill size={18} color="white" />
              {notif > 0 && <span className="topNavIconBadge"></span>}
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
