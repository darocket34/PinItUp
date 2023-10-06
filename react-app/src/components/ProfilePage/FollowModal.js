import { Link } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserById } from "../../store/session";

function FollowModal({creator, followers, following}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const followerList = useSelector(state => state.session.creator.followers)
    const followingList = useSelector(state => state.session.creator.following)

    useEffect(() => {
        dispatch(getUserById(creator?.id))
    }, [])

    return (
        <>
            {followers ? (
                <h1>Followers</h1>
            ) : (
                <h1>Following</h1>
            )}
            <div className="profilepage follower list">
                {followerList.length > 0 && followers && (
                    followerList.map(follower => (
                        <Link key={follower.id} to={`/${follower?.username}/profile`} className="pindetail creator card" onClick={closeModal}>
                            <div className="pindetail creator card container">
                                <div className="pindetail creator image container">
                                    <img id="pindetailcreator" src={follower?.profile_img} alt="Creator Profile Picture"/>
                                </div>
                                <div className="pindetail creator card text">
                                    <p className="pindetail creator name">{follower?.name}</p>
                                    <p className="pindetail user follow">{`Followers ${follower?.followers?.length}`}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
                {followingList.length > 0 && following && (
                    followingList.map(following => (
                        <Link key={following.id} to={`/${following?.username}/profile`} className="pindetail creator card" onClick={closeModal}>
                            <div className="pindetail creator card container">
                                <div className="pindetail creator image container">
                                    <img id="pindetailcreator" src={following?.profile_img} alt="Creator Profile Picture"/>
                                </div>
                                <div className="pindetail creator card text">
                                    <p className="pindetail creator name">{following?.name}</p>
                                    <p className="pindetail user follow">{`Followers ${following?.followers?.length}`}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}

            </div>
        </>
    )
}

export default FollowModal;
