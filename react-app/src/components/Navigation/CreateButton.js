import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import PinUpdateModal from "../Pins/PinUpdateModal";
import "./Navigation.css"
import PinDetails from "../Pins/PinDetails";
import { Link } from "react-router-dom";
import BoardModal from "../Boards/BoardModal";
import LoginFormModal from "../LoginFormModal";

function CreateButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [chevron, setChevron] = useState("down")
	const [makeCreateActive, setMakeCreateActive] = useState(false)
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) {
      setMakeCreateActive(true)
      return;
    } else {
      setMakeCreateActive(false)
    }
    setShowMenu(true);
    setChevron('up')
    setMakeCreateActive(true)

    // if (makeCreateActive) {
    //   setMakeCreateActive(false)
    // } else {
    //   setMakeCreateActive(true)
    // }
    console.log(makeCreateActive)
  };

  useEffect(() => {
    if (!showMenu) {
      setMakeCreateActive(false)
      return;
    }
    const closeMenu = (e) => {
      if (showMenu) {
        setShowMenu(false);
        setMakeCreateActive(false)
      } else {
        setMakeCreateActive(true)
      }

      setChevron('down')
      setMakeCreateActive(false)
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = "profile-dropdown create master container" + (showMenu ? "" : " hidden");
  const closeMenu = () => {
    setShowMenu(false);
    setMakeCreateActive(false)
  }

  return (
    <>
      <button className="navbar menu create"
        id={makeCreateActive ? "navbar_create_button_active": "navbar_create_button" }
        onClick={openMenu}>
        <p className='navbar create text' id="navbar_create">Create</p>
        <i className={`fa-solid fa-chevron-${chevron} fa-xl create`} id="navbar_create"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="create menu">

            <OpenModalButton
              buttonText="Create New Pin"
              onItemClick={closeMenu}
              modalComponent={<PinUpdateModal user={user} type="create" />}
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
