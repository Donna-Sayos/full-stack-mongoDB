import React, { useState, useEffect } from "react";
import "./index.css";
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
  const [users, setUsers] = useState([]);
  const [route, setRoute] = useState({});

  async function getRoute() {
    const response = await fetch("http://localhost:5001/env");
    const route = await response.json();
    setRoute(route);
  }

  async function getUsers() {
    const response = await fetch(`${route.GET_USERS}`);
    const users = await response.json();
    setUsers(users);
  }

  useEffect(() => {
    getRoute();
    getUsers();
  }, []);
  return <div>{users}</div>;
}
