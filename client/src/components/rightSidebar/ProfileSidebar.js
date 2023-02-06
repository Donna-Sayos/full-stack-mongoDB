import React, { useState, useEffect } from "react";
import "./index.css";
import { useAuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

export default function ProfileSidebar({ user }) {
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useAuthContext();
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );

  async function getFriends() {
    try {
      const { data } = Axios.get("/api/v1/users/friends/" + user._id);
      setFriends(data);
    } catch (err) {
      console.error("Error at getting FRIENDS. ", err);
    }
  }

  useEffect(() => {
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await Axios.put(`/api/v1/users/${user._id}/unfollow`, {
          _id: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await Axios.put(`/api/v1/users/${user._id}/follow`, {
          _id: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.error("Error at following/unfollowing. ", err);
    }
  };
  return (
    <>
      {user.username !== currentUser.username && (
        <button className="rightSidebarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <IoIosRemove /> : <IoIosAdd />}
        </button>
      )}
      <h4 className="rightSidebarTitle">User information</h4>
      <div className="rightSidebarInfo">
        <div className="rightSidebarInfoItem">
          <span className="rightSidebarInfoKey">Full Name:</span>
          <span className="rightSidebarInfoValue">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div className="rightSidebarInfoItem">
          <span className="rightSidebarInfoKey">Gender:</span>
          <span className="rightSidebarInfoValue">{user.gender}</span>
        </div>
        <div className="rightSidebarInfoItem">
          <span className="rightSidebarInfoKey">Pronouns:</span>
          <span className="rightSidebarInfoValue">{user.pronouns}</span>
        </div>
      </div>
      <h4 className="rightSidebarTitle">User friends</h4>
      <div className="rightSidebarFollowings">
        {friends.map((friend) => (
          <Link
            to={"/profile/" + friend.username}
            style={{ textDecoration: "none" }}
          >
            <div className="rightSidebarFollowing">
              <img
                src={
                  friend.profilePicture
                    ? "/images/" + user.profilePicture
                    : "/images/" + "avatar/default-user-photo.png"
                }
                alt="friend"
                className="rightSidebarFollowingImg"
              />
              <span className="rightSidebarFollowingName">
                {friend.username}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
