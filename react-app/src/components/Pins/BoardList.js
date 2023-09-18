import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import "./Pins.css"
import { addPinToBoard, getAllBoards } from "../../store/boards";
import { getAllPins } from "../../store/pins";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";


export default function BoardList({boards, pin, user}){
    const [hidden, setHidden] = useState(true)
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [chevron, setChevron] = useState("down")
    const [saved, setSaved] = useState(false)
    const [test, setTest] = useState('')
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
        setChevron('up')
        if(user !== null) {
            dispatch(getAllBoards(user.username))
        }
        dispatch(getAllPins())
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

    const closeMenu = () => setShowMenu(false);

    const handleSave = async (pin, board) => {
        dispatch(addPinToBoard(pin, board))
    }

    return (
        <>
            <button className="boardlist dropdown" onClick={openMenu}>
                <p className="boardlist dropdown board button text">Save to a Board{"    "}</p>
                <i className={`fa-solid fa-chevron-${chevron} fa-xl boardlist dropdown`}></i>
            </button>
            {showMenu && (
                <>
                    <div className="boardlist dropdown master container">
                        <div className="boardlist dropdown submaster container" ref={ulRef}>
                            {user && <p className="boardlist dropdown master title">Save to board</p>}
                            <div className="boardlist dropdown subcontainer">
                                {user ? (
                                    <>
                                        {boards.length && boards?.map((board,idx) => (
                                            <div key={board?.id+idx} className="boardlist card container">
                                                <div className="boardlist card content">
                                                    <div className="boardlist card image container">
                                                        <img className="boardlist card image" id="bdimage" src={board?.previewPin?.url} />
                                                    </div>
                                                    <div className="boardlist card textcontent">
                                                        <p className="boardlist card boardname">{board?.name}</p>
                                                        <p className="boardlist card numberofpins">{board.pins.length} Pins</p>
                                                    </div>
                                                </div>
                                                <button className={`boardlist card ${saved} ${board?.pins?.some(boardPin => boardPin.id === pin.id) ? "savedClass" : "saveClass"}`} onClick={() => handleSave(pin, board)}>
                                                    <p className={board?.pins?.some(boardPin => boardPin.id === pin.id) ? "savedClass" : "saveClass"}>
                                                        {board?.pins?.some(boardPin => boardPin.id === pin.id) ? "Saved" : "Save"}
                                                    </p>
                                                </button>
                                            </div>
                                            ))}
                                    </>
                                ):(
                                    <>
                                        <p className="boardlist card boardname nouser" id="nouser">Please Log in to add to boards!</p>
                                        <OpenModalButton
                                            buttonText="Log In"
                                            onItemClick={() => closeMenu}
                                            onButtonClick={() => setShowMenu(false)}
                                            modalComponent={<LoginFormModal />}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
