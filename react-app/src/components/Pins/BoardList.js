import React, { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux";
import "./Pins.css"


export default function BoardList({boards}){
    // const boardsList = Object.values(boards)
    const [hidden, setHidden] = useState(true)
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

    return (
        <>
            <button className="boardlist dropdown" onClick={openMenu}>
                <p className="boardlist dropdown board button text">Boards{"    "}</p>
                <i className={`fa-solid fa-chevron-${chevron} fa-xl boardlist dropdown`}></i>
            </button>
            {showMenu && (
                <>
                    <div className="boardlist dropdown master container">
                        <div className="boardlist dropdown submaster container" ref={ulRef}>
                            <p className="boardlist dropdown master title">Save to board</p>
                            <div className="boardlist dropdown subcontainer">
                                {boards.map((board,idx)=> (
                                    <div key={idx} className="boardlist card container">
                                        <div className="boardlist card content">
                                            <img className="boardlist card image" src={board.preview.url} />
                                            <p className="boardlist card name">{board.name}</p>
                                        </div>
                                        <button className={`boardlist card save ${hidden}`}>Save</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
