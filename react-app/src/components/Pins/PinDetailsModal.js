import React, { useEffect, useState, useRef} from "react";
import { useModal } from "../../context/Modal";
import {useDispatch, useSelector} from "react-redux"
import {Link, useLocation, useParams} from "react-router-dom"
import {getAllPins, getSinglePin, updatePin} from "../../store/pins"
import { getUserById } from "../../store/session";
import PinUpdateModal from "./PinUpdateModal";
import OpenModalButton from "../OpenModalButton";
import DeletePinModal from "./DeletePinModal"
import BoardList from "./BoardList";
import CommentCard from "./CommentCard";
import logo from "../../images/logo.jpg";
import "./PinDetails.css"
import "./Pins.css"
import { addPinToBoard, getAllBoards } from "../../store/boards";

function PinDetailsModal({pin, user, boards}) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const [isOwner, setIsOwner] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [chevron, setChevron] = useState("down")
    const [name, setName] = useState(pin?.name || '')
    const [description, setDescription] = useState(pin?.description || '')
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
    const [creator, setCreator] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const [newComment, setNewComment] = useState('')
    const [saved, setSaved] = useState(false)
    const [comments, setComments] = useState(pin?.comments || []);
    const [updatedBoards, setUpdatedBoards] = useState(boards);
    const {id} = useParams();
    const commentRef = useRef(null);
    const newRef = useRef();
    const currPin = useSelector(state => state.pins.singlePin)

    const dateString = pin?.postDate;
    const date = new Date(dateString);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${(date.getFullYear() % 100).toString().padStart(2, '0')}`;



    const openMenu = () => {
        if (showMenu) {
            setShowMenu(false);
            setChevron('down');
        } else {
            setShowMenu(true);
            setChevron('up');
        }
    };

    const handleSave = async (pin, board) => {
        dispatch(addPinToBoard(pin, board));
        dispatch(getAllPins());
        const newBoards = await dispatch(getAllBoards(user?.username));
        setUpdatedBoards(newBoards.boards);
    }

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getSinglePin(pin.id))
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

    const handlePinUpdate = async (e) => {
        e.preventDefault()
        let errorObj = {};
        if (name.length > 60 || !name) {
            errorObj.name = "Please enter a name with 60 characters or less"
        }
        if (description.length > 300 || !description) {
            errorObj.description = "Please enter a description with 300 characters or less"
        }
        const newPin = {
            name,
            description,
            url: pin.url,
            postDate: pin.postDate,
            creatorId: pin.creatorId
        }
        setErrors(Object.values(errorObj))
        if (!Object.keys(errorObj).length){
            try {
                newPin.id = pin.id
                const resUpdate = await dispatch(updatePin(newPin))
                if (resUpdate.id){
                    setEditMode(false)
                    setName(resUpdate.name)
                    setDescription(resUpdate.description)
                    await dispatch(getSinglePin(resUpdate.id))
                } else {
                    console.log(resUpdate)
                    setErrors(resUpdate)
                }
            } catch (err) {
                if (err) {
                    errorObj.pin = "Something went wrong"
                }}
            }
        }

    return (

        <div className="pindetail modal master container">
            <img src={logo} className="pindetails logo" alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
            <button className="pindetail back link" onClick={closeModal}>Back</button>
            <div className="pindetail leftmodal container">
                <div className="pindetail imagecontainer">
                    <img className="pindetails" src={pin?.url}></img>
                </div>
                {isOwner && (
                    <div className="pindetails owner controls">
                        {!editMode && <button className="pindetails owner controls edit" onClick={() => setEditMode(true)}>Edit</button>}
                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeletePinModal pin={pin}/>}
                            onItemClick={closeModal}
                        />
                    </div>
                )}
            </div>
            <div className="pindetail rightmodal container">
                    <button className="boardlist dropdown" onClick={openMenu}>
                        <p className="boardlist dropdown board button text">Save to a Board{"    "}</p>
                        <i className={`fa-solid fa-chevron-${chevron} fa-xl boardlist dropdown`}></i>
                    </button>
                <div className="pindetail details container" ref={newRef}>
                    {showMenu && (
                        <>
                            <div className="boardlist dropdown master container">
                                <div className="boardlist dropdown submaster container" >
                                    {user && <p className="boardlist dropdown master title">Save to board</p>}
                                    <div className="boardlist dropdown subcontainer">
                                        {user && (
                                            <>
                                                {updatedBoards && updatedBoards?.map((board,idx) => (
                                                    <div key={board?.id+idx} className="boardlist card container">
                                                        <div className="boardlist card content">
                                                            <div className="boardlist card image container">
                                                                <img className="boardlist card image" id="bdimage" src={board?.previewPin?.url} />
                                                            </div>
                                                            <div className="boardlist card textcontent">
                                                                <p className="boardlist card boardname">{board?.name}</p>
                                                                <p className="boardlist card numberofpins">{board.pins.length} Pins</p>
                                                            </div>
                                                        </div>
                                                        <button className={`boardlist card ${saved} ${board?.pins?.some(boardPin => boardPin.id === currPin.id) ? "savedClass" : "saveClass"}`} onClick={() => handleSave(currPin, board)}>
                                                            <p className={board?.pins?.some(boardPin => boardPin.id === currPin.id) ? "savedClass" : "saveClass"}>
                                                                {board?.pins?.some(boardPin => boardPin.id === currPin.id) ? "Saved" : "Save"}
                                                            </p>
                                                        </button>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <p className="pindetail created date">Post Date: {formattedDate}</p>
                    {editMode ? (
                        <form className="pinform create form" id="pinform" onSubmit={handlePinUpdate}>
                            <input
                                className="pinform create name"
                                type="text"
                                placeholder="Name this pin"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <textarea
                                className="pinform create description"
                                type="text"
                                placeholder="Give a short description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <button className="profilepage owner imageedit" type="submit">Update</button>
                            <button className="profilepage owner imageedit cancel" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <h1 className="pindetail title">{currPin?.name}</h1>
                            <p className="pindetail description">{currPin?.description}</p>
                        </>
                    )}
                    <Link to={`/${creator?.username}/profile`} className="pindetail creator card" onClick={closeModal}>
                        <div className="pindetail creator card container">
                            <div className="pindetail creator image container">
                                <img id="pindetailcreator" src={creator?.profile_img} alt="Creator Profile Picture"/>
                            </div>
                            <div className="pindetail creator card text">
                                <p className="pindetail creator name">{creator?.name}</p>
                                <p className="pindetail user follow">{`Followers ${creator?.followers?.length}`}</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="comment container" ref={commentRef}>
                    <ul>Comments:
                        {comments?.length > 0 ? (
                            <>
                                {comments?.map((comment, idx) => (
                                    <li key={idx} className="pindetail comment listitem">
                                        <CommentCard comment={comment} />
                                        {comment?.creatorId === user?.id && (
                                        <button id="commentdelete" onClick={() => deleteComment(pin, comment)}>Delete</button>
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
                    <form id="commentform" onSubmit={handleSubmit}>
                        <input type="text"
                            value={newComment}
                            placeholder="Awww.. How sweet!"
                            onChange={(e) => setNewComment(e.target.value)} />
                        <button id="commentform" type="submit" disabled={disableSubmit}><i className="fa-solid fa-paper-plane commentsubmit"></i></button>
                    </form>
            </div>
        </div>
    )
}

export default PinDetailsModal;
