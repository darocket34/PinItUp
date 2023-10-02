import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { getAllBoards } from "../../store/boards"
import "../Splash/Homepage.css"
import BoardList from "./BoardList"
import { useModal } from "../../context/Modal"
import { removePinFromBoard } from "../../store/boards"
import { Link, useLocation } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import PinDetailsModal from "./PinDetailsModal"

export default function PinCard({pin, board, boardsObj, user, isOwner}) {
    const dispatch = useDispatch();
    const [hidden, setHidden] = useState(true)
    const boards = Object.values(boardsObj)
    const { closeModal } = useModal();

    const removePin = async (pin,board) => {
        const res = await dispatch(removePinFromBoard(pin,board));
    }

    return (
        <>
            <div key={pin?.id + user?.id} className="pincard master container"
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}
            >
                {!hidden && <BoardList boards={boards} pin={pin} user={user} />}
                {isOwner && !hidden && <button key={pin.id*0.3} className="boarddetails remove pin" onClick={() => removePin(pin, board)}>Remove</button>}
                <OpenModalButton
                    buttonDiv={
                        !hidden && (
                        <div key={user?.id} className="homepage single pin overlay container">
                            <p className="pincard pin name">{pin.name}</p>
                        </div>
                        )
                    }
                    onItemClick={closeModal}
                    modalComponent={<PinDetailsModal pin={pin} user={user} boards={boards}/>}
                />
                <OpenModalButton
                    buttonImage={pin.url}
                    modalComponent={<PinDetailsModal pin={pin} user={user} boards={boards}/>}
                    onItemClick={closeModal}
                />
            </div>
        </>
    )
}
