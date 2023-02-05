import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import { BiSearchAlt2, BiUserPin } from "react-icons/bi";
import { useAuthContext } from "../../context/AuthProvider";

export default function TopNav() {
  const [FR, setFR] = useState({});
  const { user } = useAuthContext();

  async function getEnv() {
    const response = await fetch("http://localhost:5001/env");
    const env = await response.json();
    setFR(env);
  }

  useEffect(() => {
    getEnv();
  }, []);

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
          <input
            placeholder="Search"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topNavRight">
        <div className="topNavLinks">
          <span className="topNavLink">Homepage</span>
          <span className="topNavLink">Timeline</span>
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
                ? FR.FILES_ROUTE + user.profilePicture
                : FR.FILES_ROUTE + "user/no-user-photo.png"
            }
            alt=""
            className="topNavImg"
          />
        </Link>
      </div>
    </div>
  );
}
