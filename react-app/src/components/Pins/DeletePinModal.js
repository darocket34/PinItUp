import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import {removePin} from "../../store/pins"

const DeletePinModal = ({pin}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const user = useSelector(state => state.session.user)

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(removePin(pin.id)).then(closeModal());
        history.push(`/${user?.username}/profile`)
    }

    return (
        <>
            <button onClick={handleDelete}>Delete</button>
        </>
    )
}

export default DeletePinModal;
