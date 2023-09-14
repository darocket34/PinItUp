import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoards } from "../../store/boards";
import { Link, useParams } from "react-router-dom";
import "./ProfilePage.css"
import { getUser } from "../../store/session";


function ProfilePage() {
    const dispatch = useDispatch();
    const {username} = useParams();
    const boards = useSelector(state => state.boards.allBoards);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        console.log(username)
        dispatch(getUser(username));
        dispatch(getAllBoards(username));
    }, []);
    return (
        <>
            <div className="profilepage upper section container">
                <img src={user.profile_img} alt="Profile Image" className="profilepage user pic" />
                <h1 className="profilepage user name">{user?.name}</h1>
                <p className="profilepage user username">{`@${user?.username}`}</p>
                {/*
                    Add ability to share profile via link as well as to edit user information
                {user.id === Object.values(boards)[0].creatorId && (
                    <div className="profilepage uppersection user options container">
                        <button className="profilepage user edit"></button>
                    </div>
                )} */}
            </div>
                <div className="profilepage lower section container">
                <ul className="profilepage board tile list">
                    {Object.values(boards).length && (
                        Object.values(boards).map((board, idx) => (
                            <>
                                <div className="profilepage board tile master container"  key={board.id}>
                                    <Link to={`/boards/${board.id}`} className="profilepage tile link" key={idx*0.1}>
                                        <div className="profilepage board tile image container">
                                            <img src={board?.pins[0]?.url || null} className="profilepage board tile main"></img>
                                            <div className="profilepage board tile nonmain images">
                                                <img src={board?.pins[1]?.url || null} className="profilepage board tile secondary"></img>
                                                <img src={board?.pins[2]?.url || null} className="profilepage board tile terciary"></img>
                                            </div>
                                        </div>
                                        <div className="profilepage board tile text container">
                                            <p className="profilepage board tile board name">{board?.name}</p>
                                            <p className="profilepage board tile number of pins">{board?.pins?.length} Pins</p>
                                        </div>
                                            {/* <ul><p>PINS:</p>
                                                {board.pins.map((pin,idx2) => (
                                                    <li key={idx2*0.12}><Link to={`/pins/${pin.id}`}>{pin?.name}</Link></li>
                                                ))}
                                            </ul> */}
                                        {/* </li> */}
                                    </Link>
                                </div>
                            </>
                        ))
                    )}
                </ul>
             </div>









            {/* <p>NAME: {user?.name}</p>
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
            </ul> */}
        </>

    )
}

export default ProfilePage;
