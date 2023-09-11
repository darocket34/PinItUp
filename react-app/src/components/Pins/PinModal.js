import React, { useEffect, useState } from "react";
import logo from "../../images/logo.jpg"

function PinModal({user, type}) {
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [selectedBoard, setSelectedBoard] = useState('')

    //! Dispatch to get all the boards
    //! Use a dropdown to choose board
    //! Grab board Id and add to submission
    //! Add onsubmit to the button (redirect to pin detail page)
    // Create pin form in backend
    // create pin route in store and pin_routes
    // pin detail page


    return (
        <>
            <img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
            {user && type==="create" && (
                <div className="pinform create master container">
                    <h1 className="pinform create title">Create a New Pin</h1>
                    <div className="pinform create form container">
                        <form className="pinform create form">
                            <ul>
                                {errors.map((error, idx) => (
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
                            <button className="pinform create submit">Create</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default PinModal;
