import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";
import Online from "../online/Online";

export default function HomeSidebar() {
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
    <>
      <div className="birthdayContainer">
        <img
          className="birthdayImg"
          src={"/images/" + "others/gift.png"}
          alt="birthday"
        />
        <span className="birthdayText">
          <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
        </span>
      </div>
      <img
        className="rightSidebarAd"
        src={"/images/" + "others/quote.png"}
        alt="self-love quote"
      />
      <h4 className="rightSidebarTitle">Online Friends</h4>
      <ul className="rightSidebarFriendList">
        {otherUsers && otherUsers.map((user) => (
          <Online key={user._id} user={user} />
        ))}
      </ul>
    </>
  );
}
