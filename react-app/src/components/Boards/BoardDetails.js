
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBoards, getBoard } from "../../store/boards";
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
    return (
        <>
            <h1>Board Details</h1>
            <Link to={`/${user.username}/profile`}>All Boards</Link>
            <h2>All Pins</h2>
            <p>Name: {board?.name}</p>
            <p>Description: {board?.description}</p>
            <div className="boarddetails pinList">Pins: {board?.pins.map((pin,idx) => (
                <Link to={`/pins/${pin.id}`} key={idx}>{pin?.name}</Link>
            ))}</div>
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
