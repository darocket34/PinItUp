import { useEffect, useState } from "react";
import { useModal, closeMenu } from "../../context/Modal";
import {useDispatch, useSelector} from "react-redux"
import {Link, useParams} from "react-router-dom"
import {getSinglePin} from "../../store/pins"
import { getAllBoards } from "../../store/boards";
import PinModal from "./PinModal";
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
        dispatch(getSinglePin(id))
        dispatch(getAllBoards(user?.username))
        const getUser = fetch(`api/users/${pin?.creatorId}`)
        if(getUser.id){
            setCreator(getUser)
            console.log(creator)
        }
        setIsLoaded(true)
    }, [dispatch, id, user])

    useEffect(() => {
        if (user?.id === pin?.creatorId) setIsOwner(true)

    })

    return (
        <>
            <h1>Pin Details</h1>
            {user?.id && (
            <Link to={`/${user?.username}/profile`} className="pindetails form redirect">Boards</Link>
            )}
            <p>Name: {pin?.name}</p>
            <p>Desc: {pin?.description}</p>
            <img className="pindetail image" src={pin?.url}></img>
            <p>Owner Id: {pin?.creatorId}</p>
            <p>Post Date: {pin?.postDate}</p>
            <p>Board: {pin?.boardId}</p>

           {isOwner && (
            <>
                <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeletePinModal pin={pin}/>}
                />
                <OpenModalButton
                    buttonText="Update"
                    modalComponent={<PinModal user={user} type="update" pin={pin}/>}
                />
            </>
           )}
        </>
    )
}

export default PinDetails;
