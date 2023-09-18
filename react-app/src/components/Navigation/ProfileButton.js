import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css"
import { Link, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
	const [makeMenuActive, setMakeMenuActive] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const [chevron, setChevron] = useState("down");
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) {
      setMakeMenuActive(true);
      return;
    }
    setMakeMenuActive(true);
    setShowMenu(true);
    setChevron('up');
  };

  useEffect(() => {
    if (!showMenu) {
      setMakeMenuActive(false);
      return;
    }
    const closeMenu = (e) => {
      if (showMenu) {
        setShowMenu(false);
        setMakeMenuActive(false);
      } else {
        setMakeMenuActive(true);
      }

      setChevron('down');
      setMakeMenuActive(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    closeMenu();
    history.push("/home");
  };

  const ulClassName = "profile-dropdown master container" + (showMenu ? "" : " hidden");
  const closeMenu = () => {
    setShowMenu(false);
    setMakeMenuActive(false);
  }

  return (
    <>
      <button className="navbar menu"
        id={showMenu ? "navbar_menu_button_active" : "navbar_menu_button"}
        onClick={openMenu}>
      <i className={`fa-solid fa-chevron-${chevron} fa-xl profile-dropdown navbar menu`} id="navbar_menu_icon"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="profile-dropdown menu">
              <Link to={`/${user.username}/profile`} onClick={closeMenu} className="profile-dropdown cardlink">
                <div className="profile-dropdown user card">
                  <img className="profile-dropdown user img" src={user.profile_img}></img>
                    <div className="profile-dropdown user acc details">
                      <li>{user.username}</li>
                      <li>{user.email}</li>
                    </div>
                </div>
              </Link>
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
