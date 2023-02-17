import React from "react";
import "./index.css";
import { FaRegTimesCircle } from "react-icons/fa";

export default function LikesModal({ likesArr }) {
  console.log("likesArr: ", likesArr);

  return (
    <div
      className="modal fade"
      id="likesModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="likesModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="head modal-header d-flex justify-content-end">
            <button className="cancel" data-dismiss="modal">
              <FaRegTimesCircle size={22} />
            </button>
          </div>
          {likesArr && likesArr.map((u) => (
            <ul className="modal-body" key={u._id}>
              <li className="d-flex justify-content-between">
                {u.firstName} {u.lastName}
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
