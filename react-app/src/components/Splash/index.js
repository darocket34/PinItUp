import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getAllPins} from "../../store/pins"
import { getAllBoards } from "../../store/boards"
import PinCard from "../Pins/PinCard";
import { Link, useHistory } from "react-router-dom";
import "./Homepage.css"

export default function HomePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false)
    const pinsObj = useSelector(state=> state.pins.allPins)
    const user = useSelector(state=>state.session.user)
    const boards = useSelector(state=>state.boards.allBoards)


    useEffect(() => {
        dispatch(getAllPins())
        dispatch(getAllBoards(user?.username))
    },[dispatch, user])

    useEffect(() => {
        if(Object.keys(pinsObj)){
            setIsLoaded(true)
        }
    })

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="homepage pin master container">
                            {Object.keys(pinsObj) && (
                                Object.values(pinsObj).map((pin, idx) => {
                                    return (
                                        <div key={idx} className='homepage single pin container'>
                                                <PinCard key={idx} pin={pin} boardsObj={boards} />
                                        </div>
                                    )
                                })
                            )}
                    </div>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}
