import React, { useState } from "react";
import "./index.css";
import Axios from "axios";
import Button from "react-bootstrap/Button";

export default function FollowButton({
  user,
  currentUser,
  dispatch,
  messageHandler,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const followed =
    currentUser &&
    currentUser.followings &&
    currentUser.followings.includes(user._id);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!followed) {
        await Axios.put(`/api/v1/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.error("Error at following in LikesModal. ", err);
    }
    setIsLoading(false);
  };

  //   const handleMessage = () => {
  //     if (messageHandler) {
  //         messageHandler();
  //     }
  //   }

  return (
    <>
      {!followed ? (
        <Button variant="primary" onClick={handleClick}>
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <span>follow +</span>
          )}
        </Button>
      ) : (
        <Button
          variant="info"
          onClick={() => console.log("you messaged ", user?.username)}
        >
          message
        </Button>
      )}
    </>
  );
}
