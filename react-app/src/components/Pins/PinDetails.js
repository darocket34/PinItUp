import { useEffect } from "react";
import PinModal from "./PinModal";
import { useModal } from "../../context/Modal";
import {useDispatch, useSelector} from "react-redux"
import {useParams} from "react-router-dom"
import {getSinglePin} from "../../store/pins"
import "./PinDetails.css"

function PinDetails() {
    const dispatch = useDispatch()
    const pin = useSelector(state=> state.pins.singlePin)
    const {id} = useParams();

    useEffect(() => {
        dispatch(getSinglePin(id))
    }, [dispatch, id])

    return (
        <>
            <h1>NEW PIN</h1>
            <p>{pin?.name}</p>
            <p>{pin?.description}</p>
            <img className="pindetail image" src={pin?.url}></img>
            <p>{pin?.creatorId}</p>
            <p>{pin?.postDate}</p>
            <p>{pin?.boardId}</p>
        </>
    )
}

export default PinDetails;
