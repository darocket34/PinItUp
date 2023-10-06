import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getAllBoards } from "../../store/boards";
import { Link, useHistory, useParams } from "react-router-dom";
import { getUserByUsername, followCurrUser, unfollowCurrUser, updateUserProfile, authenticate } from "../../store/session";
import { getAllPinsByUsername } from "../../store/pins";
import PinCard from "../Pins/PinCard";
import loadingImage from "../../images/loading.gif"
import "./ProfilePage.css"
import "../Splash/Homepage.css"
import FollowModal from "./FollowModal";
import OpenModalButton from "../OpenModalButton";


function ProfilePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const currLocation = window.location.pathname.split('/');
    const boards = useSelector(state => state.boards.allBoards);
    const user = useSelector(state => state.session.user);
    const creator = useSelector(state => state.session.creator);
    const pins = useSelector(state => state.pins.creatorPins)
    const {username} = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [textEditMode, setTextEditMode] = useState(false);
    const [imageEditMode, setImageEditMode] = useState(false);
    const [newName, setNewName] = useState(user?.name);
    const [newUsername, setNewUsername] = useState(user?.username);
    const [url, setUrl] = useState('');
    const [currUserIsFollowing, setCurrUserIsFollowing] = useState(false);
    const [activeBoards, setActiveBoards] = useState(true);
    const [activePins, setActivePins] = useState(false);
    const [pinList, setPinList] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getUserByUsername(username));
            await dispatch(getAllBoards(username));
            await dispatch(getAllPinsByUsername(username))
            if (user?.id === creator?.id) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
            if (user?.following?.length > 0){
                for (let follower of user?.following) {
                    if (follower.id === creator?.id) {
                        setCurrUserIsFollowing(true);
                        setIsLoaded(true);
                    } else {
                        setIsLoaded(true);
                    }
                }
            } else {
                setCurrUserIsFollowing(false);
            }
        }
        fetchData();
    }, [dispatch, isLoaded, username, newUsername, currUserIsFollowing, isOwner]);

    useEffect(() => {
        console.log(boards)
        if (user?.id === creator?.id) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [isOwner, currLocation]);

    const handleFollow = async () => {
        if (user?.id && creator?.id) {
            try {
                const followRes = await dispatch(followCurrUser({
                            "creator": creator.id,
                            "user": user.id
                        }))
                if (followRes.errors) {
                    setErrors(followRes.errors);
                } else {
                    setCurrUserIsFollowing(true);
                    await dispatch(getUserByUsername(username));
                }
            } catch (err) {
                setErrors(err.errors);
            }
        }
    };

    const handleUnfollow = async () => {
        if (user?.id && creator?.id) {
            try {
                const unfollowRes = await dispatch(unfollowCurrUser({
                            "creator": creator.id,
                            "user": user.id
                        }));
                if (unfollowRes.error) {
                    console.log("ERROR", unfollowRes.error);
                } else {
                    setCurrUserIsFollowing(false)
                    await dispatch(getUserByUsername(username));
                }
            } catch (err) {
                console.log("ERR", err);
            }
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (newName === user.name && newUsername === user.username){
            setTextEditMode(false);
            return;
        }
        let errObj = {};
        if (newName.length < 3){
            errObj["name"] = "Field must be between 3 and 20 characters long.";
        };
        if (newUsername.length < 3){
            errObj["username"] = "Field must be between 3 and 20 characters long.";
        };
        const reqObj = {
            text: {
                username: newUsername,
                name: newName
            },
            user
        };
        if (Object.keys(errObj).length > 0){
            setErrors(errObj);
            return;
        }
        const res = await dispatch(updateUserProfile(reqObj));
        if(res.errors){
            errObj["username"] = res.errors[0].username
            setErrors(errObj);
            return;
        } else {
            setTextEditMode(false);
            await dispatch(authenticate())
            await dispatch(getUserByUsername(res.username))

            history.push(`/${res.username}/profile`)
        }
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault()
        let errObj = {};
        if (!url) {
            setErrors({"image": "Please select an image."})
            return;
        }
        const reqObj = {
            url: url,
            user
        }
        const res = await dispatch(updateUserProfile(reqObj));
        if(res.errors){
            setErrors(errObj);
            return;
        } else {
            setImageEditMode(false);
            await dispatch(authenticate())
            await dispatch(getUserByUsername(res.username))
            history.push(`/${res.username}/profile`)
        }
    };

    return (
        <>
            <div className="profilepage upper section container">
                {imageEditMode && isOwner ? (
                    <div className="profilepage_editmode_image container">
                        <p className="profilepage_editmode_image text">Select a new profile pic</p>
                        {errors.image && <li key={344047}><p className="form required">{errors.image}</p></li>}
                        <form className="profilepage owner imageedit form" encType="multipart/form-data" onSubmit={handleImageSubmit}>
                            <input
                                id="profilepage_editmode_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUrl(e.target.files[0])}
                                required
                            />
                            <button className="profilepage owner imageedit" type="submit">Update</button>
                            <button className="profilepage owner imageedit cancel" onClick={() => setImageEditMode(false)}>Cancel</button>
                        </form>
                    </div>
                ) : (
                    <div className="profilepage user pic container">
                        {creator?.profile_img ? (
                            <img src={creator?.profile_img} alt="Profile Image" className="profilepage user pic" />
                        ) : (
                            <img src={loadingImage} alt="Profile Image" className="profilepage user pic" />
                        )}
                        {isOwner && !textEditMode && <i className="fa-solid fa-pen-to-square profilepage icon" onClick={() => setImageEditMode(true)} />}
                    </div>
                )}
                {textEditMode && !imageEditMode && isOwner ? (
                    <>
                        {errors && (
                            <ul>
                                {errors.username && <li key={344041}><p className="form required">Username: {errors.username}</p></li>}
                                {errors.name && <li key={344042}><p className="form required">Name: {errors.name}</p></li>}
                            </ul>
                        )}
                        <form className="profilepage owner textedit form" onSubmit={handleTextSubmit}>
                            <div className="profilepage_editmode_name container">
                                <input id="profilepage_editmode_name"
                                    type="text"
                                    value={newName}
                                    placeholder={creator?.name}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="profilepage_editmode_username container">
                                <input id="profilepage_editmode_username"
                                    type="text"
                                    value={newUsername}
                                    placeholder={creator?.username}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="profilepage owner textedit" type="submit">Update</button>
                            <button className="profilepage owner textedit cancel" onClick={() => setTextEditMode(false)}>Cancel</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="profilepage user name">{creator?.name}</h1>
                        <div className="profilepage followmodal container">
                            <OpenModalButton
                                buttonText={`Followers ${creator?.followers?.length}`}
                                modalComponent={<FollowModal creator={creator} followers={true} />}
                                onItemClick={closeModal}
                            />
                            <p className="profilepage user separator">{'    ·    '}</p>
                            <OpenModalButton
                                buttonText={`Following ${creator?.following?.length}`}
                                modalComponent={<FollowModal creator={creator} following={true} />}
                                onItemClick={closeModal}
                            />
                        </div>
                    </>
                )}

                {isOwner ? (
                    <div className="profilepage owner controls container">
                        {!textEditMode && !imageEditMode && <button className="profilepage owner edit" onClick={() => setTextEditMode(true)}>Edit Profile</button>}
                    </div>
                ) : (
                    <div className="profilepage nonowner controls container">
                        {currUserIsFollowing ? (
                            <button className="profilepage nonowner following" id="ppfollowing" onClick={handleUnfollow}>
                                <span className="profilepage nonowner following">Following</span>
                                <span className="profilepage nonowner unfollow">Unfollow</span>
                            </button>
                            ) : (
                            <button className="profilepage nonowner follow" onClick={handleFollow}>Follow</button>
                            )
                        }
                    </div>
                )}
            </div>
                <div className="profilepage lower section container">
                    <div className="profilepage selector">
                        <p className={`profilepage controls boards ${activeBoards}`}
                            onClick={() => {
                                setActiveBoards(true)
                                setActivePins(false)
                            }}>
                                Boards
                        </p>
                        <p className={`profilepage controls pins ${activePins}`}
                            onClick={() => {
                                setActivePins(true)
                                setActiveBoards(false)
                            }}>Pins
                        </p>
                    </div>
                    <div className="profilepage listcontainer">
                        {activeBoards ? (
                        <ul className="profilepage board tile list">
                            {Object.values(boards).length > 0 && (
                                Object.values(boards).map((board, idx) => (
                                    <div key={board.id}>
                                        <div className="profilepage board tile master container">
                                            <Link to={`/boards/${board.id}`} className="profilepage tile link" key={idx*0.1}>
                                                <div className="profilepage board tile image container">
                                                    <img src={board?.pins[0]?.url || null} className="profilepage board tile main"></img>
                                                    <div className="profilepage board tile nonmain images">
                                                        {board?.pins.length > 0 && (
                                                            <>
                                                                <img src={board?.pins[1]?.url || null} className="profilepage board tile secondary"></img>
                                                                {board?.pins?.length > 1 && (
                                                                    <img src={board?.pins[2]?.url || null} className="profilepage board tile terciary"></img>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="profilepage board tile text container">
                                                    <p className="profilepage board tile board name">{board?.name}</p>
                                                    <p className="profilepage board tile number of pins">{board?.pins?.length} Pins</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ul>) : (
                        <ul>
                            {pins?.length > 0 && (
                                <div className="profilepage pins container">
                                    {pins.map((pin,idx) => (
                                        <div key={idx} className='profilepage single pin container'>
                                            <PinCard key={idx*0.2} pin={pin} boardsObj={boards} user={user} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ul>
                        )}
                    </div>
             </div>
        </>
    )
}

export default ProfilePage;
