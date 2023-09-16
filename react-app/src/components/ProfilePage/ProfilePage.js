import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoards } from "../../store/boards";
import { Link, useParams } from "react-router-dom";
import "./ProfilePage.css"
import { getUserByUsername } from "../../store/session";


function ProfilePage() {
    const dispatch = useDispatch();
    const {username} = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [currUserIsFollowing, setCurrUserIsFollowing] = useState(false)
    const boards = useSelector(state => state.boards.allBoards);
    const user = useSelector(state => state.session.user);
    const creator = useSelector(state => state.session.creator);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getUserByUsername(username));
            await dispatch(getAllBoards(username));
            if (user?.id === creator?.id) setIsOwner(true);
            for (let follower of user?.following) {
                if (follower.id === creator?.id) {
                    setCurrUserIsFollowing(true);
                    setIsLoaded(true);
                } else {
                    setIsLoaded(true);
                }
            }
        }
        fetchData();
    }, [dispatch, isLoaded]);

    const handleEdit = (e) => {
        e.preventDefault();
        setEditMode(true)
    }

    const handleFollow = async () => {
        if (user?.id && creator?.id) {
            try {
                const followRes = await fetch(`/api/users/follow/${creator.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "creator": creator.id,
                        "user": user.id
                    })
                })
                const response = await followRes.json();
                if (response.error) {
                    console.log("ERROR", response.error)
                } else {
                    setCurrUserIsFollowing(true)
                    await dispatch(getUserByUsername(username));
                }
            } catch (err) {
                console.log("ERR", err)
            }
        }
    }

    return (
        <>
            <div className="profilepage upper section container">
                <img src={creator?.profile_img} alt="Profile Image" className="profilepage user pic" />
                {editMode ? (
                    <>
                        <p className="profilepage editmode username">Name</p>
                        <input id="profilepage_editmode_name"
                            type="text"
                            value={newName}
                            placeholder={creator?.name}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <p className="profilepage editmode username">Username</p>
                        <input id="profilepage_editmode_username"
                            type="text"
                            value={newUsername}
                            placeholder={creator?.username}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <h1 className="profilepage user name">{creator?.name}</h1>
                        <p className="profilepage user follow">{`Followers ${creator?.followers?.length}`}{'    ·    '}{`Following ${creator?.following?.length}`}</p>
                        <p className="profilepage user username">{`@${creator?.username}`}</p>
                    </>
                )}

                {isOwner ? (
                    <div className="profilepage owner controls container">
                        <button className="profilepage owner edit" onClick={handleEdit}>Edit Profile</button>
                    </div>
                ) : (
                    <div className="profilepage nonowner controls container">
                        {currUserIsFollowing ? (
                            <button className="profilepage nonowner following" id="ppfollowing" disabled={true}>Following</button>
                            ) : (
                            <button className="profilepage nonowner follow" onClick={handleFollow}>Follow</button>
                            )
                        }
                    </div>
                )}
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
        </>
    )
}

export default ProfilePage;
