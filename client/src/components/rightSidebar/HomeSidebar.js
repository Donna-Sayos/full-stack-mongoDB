import React, { useEffect, useState } from "react";
import "./index.css";
import { useAuthContext } from "../../context/auth/AuthProvider";
import Online from "./online/Online";
import { BsFillChatRightQuoteFill } from "react-icons/bs";

export default function HomeSidebar() {
  const [quote, setQuote] = useState(null);
  const { user: currentUser } = useAuthContext();

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(
        "https://official-joke-api.appspot.com/jokes/random"
      );
      const data = await res.json();

      setQuote(data);
    };

    fetcher();
  }, []);

  return (
    <div>
      <div className="quoteTable">
        <h3 className="quoteHeading">Joke of the day!</h3>

        <tr className="quoteContainer table-light">
          <td>
            <BsFillChatRightQuoteFill className="quoteLogo" />
          </td>
          <td className="phraseSetup">
            {quote && <span className="quoteText">{quote.setup}</span>}
          </td>
        </tr>
        <br />
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
      </div>

      <hr className="homeRightbarHr" />

      <h4 className="rightSidebarTitle">Online Friends</h4>
      <ul className="rightSidebarFriendList">
        {currentUser && currentUser.followings.length > 0 ? (
          currentUser.followings.map((uid, i) => (
            <Online key={i} userId={uid} />
          ))
        ) : (
          <p style={{ color: "gray" }}>No online users</p>
        )}
      </ul>
    </div>
  );
}
