import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { getAllBoards } from "../../store/boards"
import "../Splash/Homepage.css"
import BoardList from "./BoardList"
import { Link } from "react-router-dom"

export default function PinCard({pin, boardsObj, user}) {
    const [hidden, setHidden] = useState(true)
    const boards = Object.values(boardsObj)

    return (
        <>
            <div className="pincard master container"
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}
            >
                {!hidden && (
                    <div className="homepage single pin overlay container">
                            <BoardList boards={boards} pin={pin} user={user} />
                            <Link to={`/pins/${pin.id}`} className="pincard pin name">{pin.name}</Link>
                    </div>
                )}
                <Link className="pincard image link" to={`/pins/${pin.id}`}>
                    <img className='pincard image' src={pin.url} />
                </Link>
            </div>
        </>
    )
}
