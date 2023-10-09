import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { useModal } from "../../context/Modal";
import { getUserById } from "../../store/session";
import "./PinDetails.css"
import { Link } from "react-router-dom";


export default function CommentCard({comment}) {
    const dispatch = useDispatch();
    const [creator, setCreator] = useState({});
    const { closeModal } = useModal();

    const dateString = comment?.date;
    const date = new Date(dateString);
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      };
    const formattedLocalDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${(date.getDate()).toString().padStart(2, '0')}/${(date.getFullYear() % 100).toString().padStart(2, '0')} ${date.toLocaleTimeString(undefined, options)}`;


    useEffect(() => {
        const fetchData = async () => {
            const req = await dispatch(getUserById(comment?.creatorId))
            const res = await req
            if (res?.id) {
                setCreator(res)
            }
        }
        fetchData();
    }, [])


    return (
        <>
            <div className="pindetail comment card master container">
                <div className="pindetail comment subcontainer">
                    <Link to={`/${creator?.username}/profile`} className="pindetail comment image container" onClick={closeModal}>
                        <img id="commentcreator" src={creator?.profile_img} alt="Commenter Profile Picture"/>
                    </Link>
                    <div className="pindetail comment text container">
                        <div className="pindetail comment text subcontainer">
                            <Link to={`/${creator?.username}/profile`} className="pindetail comment commenter" onClick={closeModal}>{creator?.name}{'  '}<span className="pindetail comment text">{comment?.comment}</span></Link>
                        </div>
                        <p className="pindetail comment date">{formattedLocalDate}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
