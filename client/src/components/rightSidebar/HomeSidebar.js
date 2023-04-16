import React, { useEffect, useState } from "react";
import "./index.css";
import Axios from "axios";
import { useAuthContext } from "../../context/auth/AuthProvider";
import { useOnlineContext } from "../../context/online/OnlineContextProvider";
import Online from "./online/Online";
import { BsFillChatRightQuoteFill } from "react-icons/bs";

export default function HomeSidebar() {
  const [quote, setQuote] = useState(null);
  const { user: currentUser } = useAuthContext();
  const { onlineUsers, isLoading } = useOnlineContext();

  useEffect(() => {
    let isSubscribed = true;
    const fetcher = async () => {
      const { data } = await Axios.get(
        "https://official-joke-api.appspot.com/jokes/random"
      );

      if (isSubscribed) {
        setQuote(data);
      }
    };

    fetcher();

    return () => (isSubscribed = false);
  }, []);

  return (
    <div>
      <h3 className="quoteHeading">Joke of the day!</h3>
      <table className="quoteTable">
        <tbody>
          <tr className="quoteContainer table-light">
            <td>
              <BsFillChatRightQuoteFill className="quoteLogo" />
            </td>
            <td className="phraseSetup">
              {quote && <span className="quoteText">{quote.setup}</span>}
            </td>
          </tr>
          <tr className="quoteContainer table-light">
            <td>
              <img
                className="quoteLogo"
                src={"/assets/" + "others/laugh.png"}
                alt="laugh emoji"
              />
            </td>
            <td className="phrasePunchline">
              {quote && <span className="quoteText">{quote.punchline}...</span>}
            </td>
          </tr>
        </tbody>
      </table>

      <hr className="homeRightbarHr" />

      <h4 className="rightSidebarTitle">Online Friends</h4>
      {isLoading ? (
        <div className="loading">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <ul className="rightSidebarFriendList">
          {onlineUsers.filter((user) => currentUser.followings.includes(user.userId)) 
          // this line filters the onlineUsers array to only include users that are in the currentUser's followings array
            .length > 0 ? ( // if there are online users in the currentUser's followings array, map through them and render them
            onlineUsers
              .filter((user) => currentUser.followings.includes(user.userId)) // this excludes the currentUser from the onlineUsers array
              .map((user, index) => <Online key={index} userId={user.userId} />)
          ) : (
            <p className="noOnlineUsers">No online users</p>
          )}
        </ul>
      )}
    </div>
  );
}
