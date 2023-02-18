import React, { useState, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { Link } from "react-router-dom";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import ProfilePic from "../../common/pic/ProfilePic";

const rightSidebarFollowingImg = {
  width: "100px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "5px",
};

export default function ProfileSidebar({ specificUser }) {
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useAuthContext();
  const [followed, setFollowed] = useState(
    currentUser &&
      currentUser.followings &&
      currentUser.followings.includes(specificUser?._id)
  );
  const [isLoading, setIsLoading] = useState(false);

  async function getFriends() {
    try {
      const { data } = await Axios.get(
        "/api/v1/users/friends/" + specificUser._id
      );
      setFriends(data.friends);
    } catch (err) {
      console.error("Error at getting FRIENDS. ", err);
    }
  }

  useEffect(() => {
    getFriends();
  }, [specificUser]);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (followed) {
        await Axios.put(`/api/v1/users/${specificUser._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: specificUser._id });
      } else {
        await Axios.put(`/api/v1/users/${specificUser._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: specificUser._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.error("Error at following/unfollowing. ", err);
    }
    setIsLoading(false);
  };

  return (
    <>
      {specificUser && specificUser.username !== currentUser.username && (
        <button className="rightSidebarFollowButton" onClick={handleClick}>
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          ) : followed ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
          {isLoading ? null : followed ? <IoIosRemove /> : <IoIosAdd />}
        </button>
      )}
      <h4 className="rightSidebarTitle">User information</h4>
      {specificUser && (
        <div className="rightSidebarInfo">
          <div className="rightSidebarInfoItem">
            <span className="rightSidebarInfoKey">Full Name:</span>
            <span className="rightSidebarInfoValue">
              {specificUser.firstName} {specificUser.lastName}
            </span>
          </div>
          <div className="rightSidebarInfoItem">
            <span className="rightSidebarInfoKey">Gender:</span>
            <span className="rightSidebarInfoValue">{specificUser.gender}</span>
          </div>
          <div className="rightSidebarInfoItem">
            <span className="rightSidebarInfoKey">Pronouns:</span>
            <span className="rightSidebarInfoValue">
              {specificUser.pronouns}
            </span>
          </div>
        </div>
      )}
      <h4 className="rightSidebarTitle text-center mt-5">User friends</h4>
      <div className="rightSidebarFollowings">
        {friends && Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightSidebarFollowing">
                <ProfilePic style={rightSidebarFollowingImg} user={friend} />
                <span className="rightSidebarFollowingName">
                  {friend.username}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p>No friends</p>
        )}
      </div>
    </>
  );
}
