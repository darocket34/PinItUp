import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { getAllBoards } from "../../store/boards"
import "../Splash/Homepage.css"
import BoardList from "./BoardList"
import { Link } from "react-router-dom"

export default function PinCard({pin, boardsObj}) {
    // const dispatch = useDispatch()
    const [hidden, setHidden] = useState(true)
    // const user = useSelector(state=>state.session.user)
    const boards = Object.values(boardsObj)

    // const handleSave = async (e) => {
    //     e.preventDefault()
    //     const res = await fetch(`/api/pins/${pin.id}`, {
    //         method: "put",
    //         headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify(pin),
    //     })
    // }

    return (
        <>
            <div className="pincard master container"
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}
            >
                {!hidden && (
                    <div className="homepage single pin overlay container">
                            <BoardList boards={boards} pin={pin} />
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
