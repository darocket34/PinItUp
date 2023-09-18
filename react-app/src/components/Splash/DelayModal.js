import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import {removePin} from "../../store/pins"

const DelayModal = () => {
    const { closeModal } = useModal();

    return (
        <>
            <div className="delay container">
                <h1 className="loading">Loading...</h1>
            </div>
        </>
    )
}

export default DelayModal;
