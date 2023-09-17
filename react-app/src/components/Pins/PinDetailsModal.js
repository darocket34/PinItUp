import React, { useEffect, useState, useRef} from "react";
import { useModal } from "../../context/Modal";
import {useDispatch, useSelector} from "react-redux"
import {Link, useLocation, useParams} from "react-router-dom"
import {getSinglePin} from "../../store/pins"
import { getUserById } from "../../store/session";
import PinUpdateModal from "./PinUpdateModal";
import OpenModalButton from "../OpenModalButton";
import DeletePinModal from "./DeletePinModal"
import "./PinDetails.css"
import BoardList from "./BoardList";

function PinDetailsModal({pin, user, boards}) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const [isOwner, setIsOwner] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [errors, setErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
    const [creator, setCreator] = useState({})
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState(pin?.comments || []);
    const {id} = useParams();
    const commentRef = useRef(null);
    const currPin = useSelector(state => state.pins.singlePin)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getSinglePin(pin.id))
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
    }, [dispatch, id, isLoaded, disableSubmit, comments])

    useEffect(() => {
        if (newComment?.length < 1){
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [newComment])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newComment.length > 250 || !newComment) {
            setErrors({'error': "Please enter a comment"})
        }

        const newCommentForm = {
            creatorId: user.id,
            pinId: pin.id,
            comment: newComment
        }

        try {
            const res = await fetch(`/api/pins/${pin.id}/comment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(newCommentForm)
            })
            if (res.ok){
                const newCommentData = await res.json();
                if(comments?.length > 0){
                    setComments(previous => [...previous, newCommentData]);
                } else {
                    setComments(newCommentData)
                }
                setNewComment('')
                if (commentRef.current) {
                    commentRef.current.scrollTop = commentRef.current.scrollHeight;
                  }
                await dispatch(getSinglePin(pin.id))
            } else {
                console.log("RES", res)
            }
        } catch (err) {
            console.log("ERR", err)
        }
    }

    const deleteComment = async (pin, comment) => {
        try {
            console.log("BEFORE", pin)
            const res = await fetch(`/api/pins/${pin.id}/comment`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    pin, comment
                })
            })
            if (res.ok){
                const currPinComments = await res.json();
                console.log(currPinComments)
                await dispatch(getSinglePin(currPin.id))
                setComments(currPinComments)
                setNewComment('')
                if (commentRef.current) {
                    commentRef.current.scrollTop = commentRef.current.scrollHeight;
                  }
                console.log("AFTER", pin)
            } else {
                console.log("RES", res)
            }
        } catch (err) {
            console.log("ERR", err)
        }
    }

    return (
        <div className="pindetail modal master container">
                <button className="pindetail back link" onClick={closeModal}>Back</button>
            <div className="pindetail leftmodal container">
                <h1>{pin.name}</h1>
                <div className="pindetail imagecontainer">
                    <img className="pindetails" src={pin?.url}></img>
                </div>
            </div>
            <div className="pindetail rightmodal container">
                <div className="pindetail details container">
                    {user?.id && (
                        <>
                            <BoardList boards={boards} pin={pin} user={user} />
                        </>
                    )}
                    {creator?.username && <Link to={`/${creator?.username}/profile`} onClick={closeModal}>Creator: {pin?.name}</Link>}
                    <p className="test">Desc: {pin?.description}</p>
                    <p>Owner Id: {pin?.creatorId}</p>
                    <p>Post Date: {pin?.postDate}</p>
                    <p>Board: {pin?.boardId}</p>
                </div>
                <div className="comment container" ref={commentRef}>
                    <ul>Comments:
                        {comments?.length > 0 ? (
                            <>
                            {comments?.map((comment, idx) => (
                                <li key={idx}>
                                    <p>Date: {comment.date}</p>
                                    <p>Commenter: {comment.creatorId}</p>
                                    <p>Comment: {comment.comment}</p>
                                    {comment.creatorId === user.id && (
                                        <button className="comment delete" onClick={() => deleteComment(pin, comment)}>Delete</button>
                                    )}
                                </li>
                             ))}
                            </>
                        ) : (
                            <p>Be the first to comment!</p>
                        )}
                    </ul>
                </div>
                    {errors.length > 0 && errors.map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                ))}
                    <form className="commentform" onSubmit={handleSubmit}>
                        <input type="text"
                            value={newComment}
                            placeholder="Awww.. How sweet!"
                            onChange={(e) => setNewComment(e.target.value)} />
                        <button className="commentform submit" type="submit" disabled={disableSubmit}>Submit</button>
                    </form>
                {isOwner && (
                    <div className="pindetails owner conrols">
                        <OpenModalButton
                            buttonText="Update"
                            modalComponent={<PinUpdateModal user={user} type="update" pin={pin}/>}
                            onItemClick={closeModal}
                        />
                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeletePinModal pin={pin}/>}
                            onItemClick={closeModal}
                        />
                    </div>
                )}
            </div>


        </div>
    )
}

export default PinDetailsModal;
