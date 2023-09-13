import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoards } from "../../store/boards";
import { Link } from "react-router-dom";


function ProfilePage() {
    const dispatch = useDispatch()
    const boards = useSelector(state => state.boards.allBoards)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getAllBoards(user?.username))
        console.log(boards)
    }, [])
    return (
        <>
            <h1>ProfilePage</h1>
            <p>NAME: {user?.name}</p>
            <p>USERNAME: {user?.username}</p>
            <p>BOARDS:</p>
            <ul>
            {Object.values(boards).length && (
                Object.values(boards).map((board, idx) => (
                    <li key={idx}>
                        <Link to={`/boards/${board?.id}`} key={idx}>{board?.name}</Link>
                        <ul><p>PINS:</p>
                            {board.pins.map((pin,idx2) => (
                                <li key={idx2*0.12}><Link to={`/pins/${pin.id}`}>{pin?.name}</Link></li>
                            ))}
                        </ul>
                    </li>
                ))
            )}

            </ul>
        </>

    )
}

export default ProfilePage;
