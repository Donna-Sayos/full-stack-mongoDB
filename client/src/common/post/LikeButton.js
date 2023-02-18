import React from "react";
import "./index.css";

export default function LikeButton({ onClick, style }) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <img
      className="likeButton"
      src={"/assets/" + "others/heart.png"}
      onClick={handleClick}
      alt="heart"
      style={style}
    />
  );
}
