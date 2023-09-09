import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getAllPins} from "../../store/pins"
import PinCard from "../Pins/PinCard";
import "./Homepage.css"

export default function HomePage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const pinsObj = useSelector(state=> state.pins.allPins)

    useEffect(() => {
        dispatch(getAllPins())
    },[dispatch])

    useEffect(() => {
        if(Object.keys(pinsObj)){
            setIsLoaded(true)
        }
    })


    return (
        <>
            {isLoaded && (
                <>
                    <div className="homepage pin master container">
                            {Object.keys(pinsObj) && (
                                Object.values(pinsObj).map((pin, idx) => {
                                    return (
                                        <div key={idx} className="homepage single pin container">
                                            <PinCard key={idx} pin={pin} />
                                        </div>
                                    )
                                })
                            )}
                    </div>
                </>
            )}
        </>
    )
}
