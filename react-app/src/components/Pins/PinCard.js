import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { getAllBoards } from "../../store/boards"
import "../Splash/Homepage.css"
import BoardList from "./BoardList"

export default function PinCard({pin, boardsObj}) {
    // const dispatch = useDispatch()
    const [hidden, setHidden] = useState(true)
    // const user = useSelector(state=>state.session.user)
    const boards = Object.values(boardsObj)

    return (
        <>
            <div className="pincard master container"
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}>
                {!hidden && (
                    <div className="homepage single pin overlay container">
                        <div className='homepage single pin overlay display top'>

                            <BoardList boards={boards} />
                            <button className="homepage single pin overlay save">Save
                                {/* <p className="homepage single pin overlay save">Save</p> */}
                            </button>
                        </div>
                        <div className='homepage single pin overlay display bottom'>
                            <p>{pin.name}</p>
                        </div>
                    </div>
                )}
                <img className='pincard image' src={pin.url}></img>
            </div>
        </>
    )
}
