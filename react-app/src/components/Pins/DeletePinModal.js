import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import {removePin} from "../../store/pins"

const DeletePinModal = ({pin}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(removePin(pin.id)).then(closeModal());
        history.push("/home")
    }

    return (
        <>
            <button onClick={handleDelete}>Delete</button>
        </>
    )
}

export default DeletePinModal;
