import React from "react";
import "./index.css";
import { useAuthContext } from "../../context/AuthProvider";
import Online from "../online/Online";

export default function HomeSidebar() {
  const { user: currentUser } = useAuthContext();

  return (
    <div>
      <div className="birthdayContainer">
        <img
          className="birthdayImg"
          src={"/assets/" + "others/gift.png"}
          alt="birthday"
        />
        <span className="birthdayText">
          <b>You</b> are <b>very</b> amazing!{" "}
          {/* TODO: add a birthday section */}
        </span>
      </div>
      <img
        className="rightSidebarAd"
        src={"/assets/" + "others/quote.png"}
        alt="self-love quote"
      />
      <h4 className="rightSidebarTitle">Online Friends</h4>
      <ul className="rightSidebarFriendList">
        {currentUser && currentUser.followings.length > 0 ? (
          currentUser.followings.map((user, i) => (
            <Online key={i} user={user} />
          ))
        ) : (
          <p style={{ color: "gray" }}>No online users</p>
        )}
      </ul>
    </div>
  );
}
