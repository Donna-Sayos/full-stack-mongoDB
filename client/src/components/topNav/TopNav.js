import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import { BiSearchAlt2, BiUserPin } from "react-icons/bi";
import { useAuthContext } from "../../context/auth/AuthProvider";
import ProfilePic from "../../common/pic/ProfilePic";

export default function TopNav({ setDisplayFeed }) {
  const { user } = useAuthContext();

  const topNavImg = {
    width: "32px",
    height: "32px",
    objectFit: "cover",
    borderRadius: "50%",
    cursor: "pointer",
  }

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
          <Link
            to="/?feed"
            className="navLink"
            onClick={() => setDisplayFeed("friendFeeds")}
          >
            <span className="topNavLink">Feed</span>
          </Link>
          <Link
            to="/?explore"
            className="navLink"
            onClick={() => setDisplayFeed("allFeeds")}
          >
            <span className="topNavLink">Explore</span>
          </Link>
        </div>
        <div className="topNavIcons">
          <div className="topNavIconItem">
            <BiUserPin size={25} />
            {/* <span className="topNavIconBadge">1</span> */}
          </div>
          <div className="topNavIconItem">
            <BsFillChatLeftTextFill size={18} />
            {/* <span className="topNavIconBadge">2</span> */}
          </div>
          <div className="topNavIconItem">
            <BsFillBellFill size={18} />
            {/* <span className="topNavIconBadge">1</span> */}
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <ProfilePic style={topNavImg} user={user} />
        </Link>
      </div>
    </div>
  );
}
