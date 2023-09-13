import React, {useEffect, useState, useContext} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getAllPins} from "../../store/pins"
import { getAllBoards } from "../../store/boards"
import PinCard from "../Pins/PinCard";
import { PinSearchContext } from "../../context/PinSearch";
import { useHistory } from "react-router-dom";

export default function SearchPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {searchPins} = useContext(PinSearchContext)
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchDetails, setSearchDetails] = useState([])
    const pinsObj = useSelector(state=> state.pins.allPins)
    const user = useSelector(state=>state.session.user)
    const boards = useSelector(state=>state.boards.allBoards)


    useEffect(() => {
        if (user === null) {
            history.push('/notfound')
        } else {
            dispatch(getAllPins())
            dispatch(getAllBoards(user?.username))
        }
    },[dispatch])

    useEffect(() => {
        const search = new RegExp(`${searchPins}.*`, 'i')
        if(Object.keys(pinsObj)){
            const pinsList = Object.values(pinsObj)
            setSearchDetails(pinsList.filter(pin => search.exec(pin.name) || search.exec(pin.description)))
            setIsLoaded(true)
        }
    }, [searchPins])

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="homepage pin master container">
                            {searchDetails.length ? (
                                searchDetails.map((pin, idx) => {
                                    return (
                                        <div key={idx} className='homepage single pin container'>
                                                <PinCard key={idx} pin={pin} boardsObj={boards} />
                                        </div>
                                    )
                                })
                            ) : (
                                <h1>No Pins Found</h1>
                            )}
                    </div>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}
