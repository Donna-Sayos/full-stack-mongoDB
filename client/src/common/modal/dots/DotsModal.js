import React, { useRef, useEffect } from "react";
import "./index.css";
import Axios from "axios";
import { FaRegTimesCircle } from "react-icons/fa";

export default function DotsModal({ deleteHandler, postId }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        const modal = document.querySelector(".dotModal");
        $(modal).modal("hide");
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [modalRef]);

  return (
    <div
      className="modal fade dotModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dotModal"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="head modal-header d-flex justify-content-end">
            <button className="cancel" data-dismiss="modal">
              <FaRegTimesCircle size={22} />
            </button>
          </div>
          <div className="text-center">
            <button className="options" onClick={() => deleteHandler(postId)}>
              delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
