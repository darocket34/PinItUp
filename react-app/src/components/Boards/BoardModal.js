import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import logo from "../../images/logo.jpg"
import { createBoard, updateBoard } from "../../store/boards";

function BoardModal({user, type, board}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const {closeModal} = useModal()

    useEffect(() => {
        if(board?.name){
            setName(board?.name)
            setDescription(board?.description)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let errorObj = {};
        if (name.length > 60 || !name) {
            errorObj.name = "Please enter a name with 60 characters or less"
        }
        if (description.length > 300 || !description) {
            errorObj.description = "Please enter a description with 300 characters or less"
        }
        setErrors(Object.values(errorObj))
        let newBoard = {
            name,
            description,
            creatorId: user.id
        }
        if (!Object.keys(errorObj).length){
            try {
                if (type === "update"){
                    newBoard.id = board.id
                    const resUpdate = await dispatch(updateBoard(newBoard))
                    if (resUpdate.errors){
                        setErrors(resUpdate)
                    } else {
                        closeModal()
                        history.push(`/boards/${newBoard.id}`)
                    }
                } else {
                    const resUpdate = await dispatch(createBoard(newBoard))
                    if (resUpdate.errors){
                        setErrors(resUpdate)
                    } else {
                        closeModal()
                        history.push(`/boards/${resUpdate.id}`)
                    }
                }
            } catch (err) {
                    if (err) {
                        errorObj.pin = "Something went wrong"
                    }}
            }
        }


    return (
        <>
             <img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
             {user && (
                <div className="pinform create master container">
                <h1 className="pinform create title">{type === "update" ? "Update":"Create"} a New Board</h1>
                <div className="pinform create form container">
                    <form className="pinform create form" id="pinform" onSubmit={handleSubmit}>
                        <ul>
                            {errors.length > 0 && errors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                        <label>
                            Title
                            <input
                                className="pinform create name"
                                type="text"
                                placeholder="Name this board"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Description
                            <textarea
                                className="pinform create description"
                                type="text"
                                placeholder="Give a short description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </label>
                        <button className="pinform create submit" type="submit" disabled={false}>{type === "update" ? "Update":"Create"}</button>
                    </form>
                </div>
            </div>
             )}
        </>
    )
}

export default BoardModal;
