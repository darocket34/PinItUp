import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { getAllBoards } from "../../store/boards"
import "../Splash/Homepage.css"
import BoardList from "./BoardList"
import { useModal } from "../../context/Modal"
import { Link, useLocation } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import PinDetailsModal from "./PinDetailsModal"

export default function PinCard({pin, boardsObj, user}) {
    const [hidden, setHidden] = useState(true)
    const boards = Object.values(boardsObj)
    const { closeModal } = useModal();

    return (
        <>
            <div className="pincard master container"
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}
            >
                {!hidden && <BoardList boards={boards} pin={pin} user={user} />}
                <OpenModalButton
                    buttonDiv={
                        !hidden && (
                        <div className="homepage single pin overlay container">

                            <p className="pincard pin name">{pin.name}</p>
                        </div>
                        )
                    }
                    onItemClick={closeModal}
                    modalComponent={<PinDetailsModal pin={pin} user={user} boards={boards}/>}
                />
                {/* <Link className="pincard image link" to={`/pins/${pin.id}`}>
                    <img className='pincard image' src={pin.url} />
                </Link> */}
                <OpenModalButton
                    buttonImage={pin.url}
                    modalComponent={<PinDetailsModal pin={pin} user={user} boards={boards}/>}
                    onItemClick={closeModal}
                />
            </div>
        </>
    )
}
