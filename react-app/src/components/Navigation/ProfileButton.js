import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css"

function ProfileButton({ user }) {
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

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const ulClassName = "profile-dropdown master container" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button className="navbar menu" onClick={openMenu}>
      <i className={`fa-solid fa-chevron-${chevron} fa-xl profile-dropdown`}></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="profile-dropdown menu">
              <div className="profile-dropdown user card">
                <img className="profile-dropdown user img" src={user.profile_img}></img>
                <div className="profile-dropdown user acc details">
                  <li>{user.username}</li>
                  <li>{user.email}</li>
                </div>
              </div>

              <li>
                <button className="modal" onClick={handleLogout}>Log Out</button>
              </li>
            </div>
          </>
        ) : (
          <div className="profile-dropdown menu">
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
