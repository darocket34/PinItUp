import React, { useEffect, useState } from "react";
import logo from "../../images/logo.jpg"
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createPin, updatePin } from "../../store/pins";
import {useHistory} from "react-router-dom"
import "./Pins.css"
import { addPinToBoard, getBoard } from "../../store/boards";

function PinUpdateModal({user, type, pin}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [selectedBoard, setSelectedBoard] = useState('')
    const { closeModal } = useModal();
    const boards = useSelector(state=> state.boards.allBoards)

    useEffect(() => {
        if(pin?.name){
            setName(pin?.name)
            setDescription(pin?.description)
            setUrl(pin?.url)
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
        if (!selectedBoard) {
            errorObj.selectedBoard = "Please select a board to save this pin to"
        }
        const getCurrentDate = () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        const today = getCurrentDate();

        const newPin = {
            name,
            description,
            url,
            postDate: today,
            creatorId: user.id
        }
        setErrors(Object.values(errorObj))
        let resPin
        if (!Object.keys(errorObj).length){
            try {
                if (type === "update"){
                    newPin.id = pin.id
                    const resUpdate = await dispatch(updatePin(newPin))
                    if (resUpdate.errors){
                        setErrors(resUpdate)
                    } else {
                        closeModal()
                        history.push(`/pins/${newPin.id}`)
                    }
                } else {
                    const uploadForm = new FormData()
                    uploadForm.append("name", name);
                    uploadForm.append("description", description);
                    uploadForm.append("url", url);
                    uploadForm.append("creatorId", user.id);
                    uploadForm.append("postDate", newPin.postDate);
                    uploadForm.append("boardId", selectedBoard);
                    const upload = await fetch("/api/pins/newpin", {
                        method: "POST",
                        body: uploadForm
                    })
                    const resUpload = await upload.json();
                    if (resUpload.errors){
                        setErrors(resUpload)
                    } else {
                        const newlySelectedBoard = {"id": Number(selectedBoard)}
                        dispatch(addPinToBoard(resUpload, newlySelectedBoard))
                        history.push(`/boards/${Number(selectedBoard)}`)
                        dispatch(getBoard(Number(selectedBoard)))
                        closeModal()
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
                    <h1 className="pinform create title">{type === "update" ? `Update ${pin?.name}`:"Create a New Pin"}</h1>
                    <div className="pinform create form container">
                        <form className="pinform create form" encType="multipart/form-data" id="pinform" onSubmit={handleSubmit}>
                            <ul>
                                {errors.length > 0 && errors.map((error, idx) => (
                                    <li key={idx} style={{color: 'red'}}>{error}</li>
                                ))}
                            </ul>
                            <label>
                                Title
                                <input
                                    className="pinform create name"
                                    type="text"
                                    placeholder="Name this pin"
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
                            {type !== "update" && (
                            <label>
                                Image
                                <input
                                    className="pinform create image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setUrl(e.target.files[0])}
                                    required
                                />
                            </label>
                            )}
                            {type === "create" && (
                            <label>
                                Board
                                <select
                                    className="pinform create boardlist"
                                    placeholder="Select"
                                    name="boardId"
                                    value={selectedBoard}
                                    onChange={(e) => setSelectedBoard(e.target.value)}
                                    required>
                                        <option key='select' value={null}>Select one of your boards</option>
                                        {Object.values(boards).map((board, idx) => (
                                            <option key={idx}
                                            value={board.id}>
                                            {board.name}</option>
                                        ))}
                                </select>
                            </label>)}
                            <button className="pinform create submit" type="submit" disabled={false}>{type === "update" ? "Update":"Create"}</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default PinUpdateModal;
