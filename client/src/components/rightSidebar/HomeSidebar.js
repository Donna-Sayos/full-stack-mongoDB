import React from "react";
import "./index.css";
import Online from "../online/Online";

export default function HomeSidebar({ user }) {
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
        {user && Array.isArray(user) && user.map((user) => (
          <Online key={user._id} user={user} />
        ))}
      </ul>
    </>
  );
}
