import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import "../Splash/Homepage.css"

export default function PinCard({pin}) {
    return (
        <>
            <div className="pincard master container">
                <img className='pincard image' src={pin.url}></img>
            </div>
        </>
    )
}
