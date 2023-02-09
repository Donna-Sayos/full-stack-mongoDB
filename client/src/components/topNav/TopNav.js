import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import { BiSearchAlt2, BiUserPin } from "react-icons/bi";
import { useAuthContext } from "../../context/AuthProvider";

export default function TopNav() {
  const { user } = useAuthContext();

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
          <span className="topNavLink">Homepage</span> {/* TODO: add navigate() */}
          <span className="topNavLink">Timeline</span> {/* TODO: add navigate() */}
        </div>
        <div className="topNavIcons">
          <div className="topNavIconItem">
            <BiUserPin size={25} />
            <span className="topNavIconBadge">1</span>
          </div>
          <div className="topNavIconItem">
            <BsFillChatLeftTextFill size={18} />
            <span className="topNavIconBadge">2</span>
          </div>
          <div className="topNavIconItem">
            <BsFillBellFill size={18} />
            <span className="topNavIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? "/assets/" + user.profilePicture
                : "/assets/" + "user/default-user-photo.png"
            }
            alt="user"
            className="topNavImg"
          />
        </Link>
      </div>
    </div>
  );
}
