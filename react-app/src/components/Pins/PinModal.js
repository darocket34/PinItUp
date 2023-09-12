import React, { useEffect, useState } from "react";
import logo from "../../images/logo.jpg"
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createPin, updatePin } from "../../store/pins";
import {useHistory} from "react-router-dom"
import "./Pins.css"

function PinModal({user, type, pin}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState('' || pin?.name)
    const [description, setDescription] = useState('' || pin?.description)
    const [url, setUrl] = useState('' || pin?.url)
    const [selectedBoard, setSelectedBoard] = useState('' || pin?.boardId)
    const { closeModal } = useModal();
    const boards = useSelector(state=> state.boards.allBoards)

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
        const today = new Date();
        const getCurrentDate = () => {
            const today = new Date();
            console.log(today)
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const newPin = {
            name,
            description,
            url,
            boardId: Number(selectedBoard),
            postDate: today,
            creatorId: user.id
        }
        setErrors(Object.values(errorObj))
        // console.log(errors)
        let resPin
        if (!Object.keys(errorObj).length){
            try {
                if (type === "update"){
                    newPin.id = pin.id
                    console.log("PIN", newPin)
                    const resUpdate = dispatch(updatePin(newPin))
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
                    uploadForm.append("boardId", newPin.boardId)
                    const upload = await fetch("/api/pins/newpin", {
                        method: "POST",
                        body: uploadForm,
                    })
                    const resUpload = await upload.json();
                    console.log("RES", resUpload.pin)
                    if (resUpload.errors){
                        console.log("NOSUCCESS Backend", resUpload)
                        setErrors(resUpload)
                    } else {
                        closeModal()
                        history.push(`/pins/${resUpload.id}`)
                        console.log("SUCCESS", resUpload)
                    }
                }
            } catch (err) {
                    if (err) {
                        errorObj.pin = "Something went wrong"
                        console.log("CREATE PIN DISPATCH ERROR", err)
                    }}
            }
        }

    return (
        <>
            <img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
            {user && (
                <div className="pinform create master container">
                    <h1 className="pinform create title">{type === "update" ? "Update":"Create"} a New Pin</h1>
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
                            <label>
                                Board
                                <select
                                    className="pinform create boardlist"
                                    placeholder="Select"
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
                            </label>
                            <button className="pinform create submit" type="submit" disabled={false}>{type === "update" ? "Update":"Create"}</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default PinModal;
