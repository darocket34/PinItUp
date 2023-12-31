import React, { useEffect, useState } from "react";
import { useModal, closeMenu } from "../../context/Modal";
import {useDispatch, useSelector} from "react-redux"
import {Link, useParams} from "react-router-dom"
import {getSinglePin} from "../../store/pins"
import { getUserById } from "../../store/session";
import { getAllBoards } from "../../store/boards";
import PinUpdateModal from "./PinUpdateModal";
import OpenModalButton from "../OpenModalButton";
import DeletePinModal from "./DeletePinModal"
import "./PinDetails.css"

function PinDetails() {
    const dispatch = useDispatch()
    const [isOwner, setIsOwner] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [creator, setCreator] = useState({})
    const pin = useSelector(state=> state.pins.singlePin)
    const user = useSelector(state=> state.session.user)
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getSinglePin(id))
            // await dispatch(getAllBoards(user?.username))
            if (user?.id === pin?.creatorId) setIsOwner(true)
            setIsLoaded(true)
            if (pin?.creatorId){
                const pinCreator = await dispatch(getUserById(pin?.creatorId))
                const res = await pinCreator;
                if (res?.id) {
                    setCreator(pinCreator)
                }
            }
        }
        fetchData();
    }, [dispatch, id, isLoaded])

    return (
        <>
            <h1>Pin Details</h1>
            {user?.id && (
            <Link to={`/${user?.username}/profile`} className="pindetails form redirect">Boards</Link>
            )}
            <br></br>
            <br></br>
            {creator?.username && <Link to={`/${creator?.username}/profile`}>Creator: {pin?.name}</Link>}
            <p>Pin Name: {pin?.name}</p>
            <p>Desc: {pin?.description}</p>
            <img className="pindetail image" src={pin?.url}></img>
            <p>Owner Id: {pin?.creatorId}</p>
            <p>Post Date: {pin?.postDate}</p>
            <p>Board: {pin?.boardId}</p>
            <p>Comments: {pin?.comments?.map((comment, idx) => (
                <>
                    <p>Date: {comment.date}</p>
                    <p>Commenter: {comment.creatorId}</p>
                    <p>Comment: {comment.comment}</p>
                </>
                ))}
            </p>

           {isOwner && (
            <>
                <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeletePinModal pin={pin}/>}
                />
                <OpenModalButton
                    buttonText="Update"
                    modalComponent={<PinUpdateModal user={user} type="update" pin={pin}/>}
                />
            </>
           )}
        </>
    )
}

export default PinDetails;
