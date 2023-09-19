
import { Link, useHistory, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBoards, getBoard, removePinFromBoard } from "../../store/boards";
import OpenModalButton from "../OpenModalButton";
import DeleteBoardModal from "./DeleteBoardModal";
import BoardModal from "./BoardModal";
import "./Boards.css"
import PinCard from "../Pins/PinCard";
import { getAllPins } from "../../store/pins";

function BoardDetails() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [isOwner, setIsOwner] = useState(false);
    const board = useSelector(state => state.boards.singleBoard);
    const boards = useSelector(state => state.boards.allBoards);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getBoard(id));
        dispatch(getAllBoards(user.username));
        dispatch(getAllPins());
    },[dispatch]);

    useEffect(() => {
        if(user?.id === board?.creatorId){
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    });

    const removePin = async (pin,board) => {
        const res = await dispatch(removePinFromBoard(pin,board));
    }

    return (
        <>
            <button className="boarddetails back to boards" onClick={() => history.goBack()}>Back</button>
            <div className="boarddetails top master container">
                <h2 className="boarddetails board title">{board?.name}</h2>
                <p className="boarddetails desc">{board?.description}</p>
                {isOwner && (
                    <div className="boarddetails owner controls">
                        <OpenModalButton
                            buttonText="Update"
                            modalComponent={<BoardModal type="update" user={user} board={board}/>}
                        />
                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeleteBoardModal board={board}/>}
                        />
                    </div>
                )}
            </div>
            <div className="boarddetails pinList">
                <ul>
                    {board?.pins?.length > 0 && (
                        <div key={board?.id}className="homepage pin master container">
                            {board?.pins?.map((pin,idx) => (
                                <>
                                    <div key={idx} className='boarddetails single pin container'>
                                        <PinCard key={idx*0.2} pin={pin} boardsObj={boards} user={user} />
                                        {isOwner && <button key={pin.id}className="boarddetails remove pin" onClick={() => removePin(pin, board)}>Remove</button>}
                                    </div>
                                </>
                            ))}
                        </div>
                    )}
                </ul>
            </div>
        </>
    )
}


export default BoardDetails;
