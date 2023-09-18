import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getAllPins} from "../../store/pins"
import { getAllBoards } from "../../store/boards"
import PinCard from "../Pins/PinCard";
import "./Homepage.css"
import OpenModalButton from "../OpenModalButton";
import DelayModal from "./DelayModal";

export default function HomePage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const pinsObj = useSelector(state=> state.pins.allPins)
    const user = useSelector(state=>state.session.user)
    const boards = useSelector(state=>state.boards.allBoards)


    useEffect(() => {
        dispatch(getAllPins())
        if(user?.id){
            dispatch(getAllBoards(user?.username))
        }
        setIsLoaded(true)
    },[dispatch, user])

    useEffect(() => {

    }, [])

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="homepage pin master container">
                            {Object.keys(pinsObj) && (
                                Object.values(pinsObj).map((pin, idx) => {
                                    return (
                                        <div key={idx} className='homepage single pin container'>
                                                <PinCard key={idx} pin={pin} boardsObj={boards} user={user} />
                                        </div>
                                    )
                                })
                            )}
                    </div>
                </>
            ) : (
                <>
                    <DelayModal />
                </>
            )}
        </>
    )
}
