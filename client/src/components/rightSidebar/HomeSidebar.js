import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import Online from "../online/Online";

export default function HomeSidebar() {
  const [users, setUsers] = useState([]);

  async function getUsers() {
    const { data } = await Axios.get("/api/v1/users");
    setUsers(data);
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
          <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
        </span>
      </div>
      <img
        className="rightSidebarAd"
        src={"/images/" + "others/quote.png"}
        alt="self-love quote"
      />
      <h4 className="rightSidebarTitle">Online Friends</h4>
      <ul className="rightSidebarFriendList">
        {users.map((user) => (
          <Online key={user._id} user={user} />
        ))}
      </ul>
    </>
  );
}
