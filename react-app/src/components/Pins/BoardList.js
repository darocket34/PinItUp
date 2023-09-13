import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import "./Pins.css"
import { addPinToBoard, getAllBoards } from "../../store/boards";


export default function BoardList({boards, pin}){
    // const boardsList = Object.values(boards)
    const [hidden, setHidden] = useState(true)
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [chevron, setChevron] = useState("down")
    const [saved, setSaved] = useState(false)
    const [test, setTest] = useState('')
    const user = useSelector(state=> state.session.user)
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

    const handleSave = async (pin, board) => {
        dispatch(addPinToBoard(pin, board))
    }

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
                                {boards?.map((board,idx)=> (
                                    <div key={board?.id+idx} className="boardlist card container">
                                        <div className="boardlist card content">
                                            <img className="boardlist card image" src={board?.preview?.url} />
                                            <p className="boardlist card name">{board?.name}</p>
                                        </div>
                                        <button className={`boardlist card save ${saved}`} onClick={() => {
                                            setTest(board.pins)
                                            handleSave(pin, board)
                                            console.log(board.pins)
                                            }}>
                                            {board?.pins?.some(boardPin => boardPin.id === pin.id) ? "Saved" : "Save"}
                                        </button>
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
