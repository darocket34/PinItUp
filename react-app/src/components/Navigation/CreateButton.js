import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import PinModal from "../Pins/PinModal";
import "./Navigation.css"
import PinDetails from "../Pins/PinDetails";
import { Link } from "react-router-dom";
import BoardModal from "../Boards/BoardModal";
import LoginFormModal from "../LoginFormModal";

function CreateButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [chevron, setChevron] = useState("down")
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
    setChevron('up')
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      setChevron('down')
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = "profile-dropdown create master container" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button className="navbar menu create" onClick={openMenu}>
        <p className='navbar create text'>Create</p>
        <i className={`fa-solid fa-chevron-${chevron} fa-xl create`}></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="create menu">

            <OpenModalButton
              buttonText="Create New Pin"
              onItemClick={closeMenu}
              modalComponent={<PinModal user={user} type="create" />}
            />
            <OpenModalButton
              buttonText="Create New Board"
              onItemClick={closeMenu}
              modalComponent={<BoardModal user={user} type="create" />}
            />
          </div>
        ) : (
          <>
            <div className="create menu">
              <p>Please login to continue</p>
              <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              />
            </div>
          </>
        )}
      </ul>
    </>
    )
}

export default CreateButton;
