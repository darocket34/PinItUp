
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBoards, getBoard, removePinFromBoard } from "../../store/boards";
import OpenModalButton from "../OpenModalButton";
import DeleteBoardModal from "./DeleteBoardModal";
import BoardModal from "./BoardModal";
import "./Boards.css"

function BoardDetails() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const [isOwner, setIsOwner] = useState(false)
    const board = useSelector(state => state.boards.singleBoard)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getBoard(id))
        dispatch(getAllBoards(user.username))
    },[dispatch])

    useEffect(() => {
        if(user?.id === board?.creatorId){
            setIsOwner(true)
        } else {
            setIsOwner(false)
        }
    })

    const removePin = async (pin,board) => {
        // try {
        //     await fetch(`/api/boards/${boardId}`)
        // }
        const res = await dispatch(removePinFromBoard(pin,board))
        console.log("RES", res)
    }


    return (
        <>
            <h1>Board Details</h1>
            <Link to={`/${user.username}/profile`}>All Boards</Link>
            <h2>All Pins</h2>
            <p>Name: {board?.name}</p>
            <p>Description: {board?.description}</p>
            <div className="boarddetails pinList">
                Pins: {board?.pins.map((pin,idx) => (
                    <div key={pin.id}>
                        <Link to={`/pins/${pin.id}`} key={`l${idx}`}>{pin?.name}</Link>
                        {isOwner && (
                            <button key={`b${idx}`} className="boarddetails pinList options" onClick={() => removePin(pin,board)}>Remove</button>
                        )}
                    </div>
            ))}
            </div>
            {isOwner && (
                <>
                    <OpenModalButton
                        buttonText="Update"
                        modalComponent={<BoardModal type="update" user={user} board={board}/>}
                    />
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteBoardModal board={board}/>}
                    />
                </>
            )}

        </>
    )
}


export default BoardDetails;
