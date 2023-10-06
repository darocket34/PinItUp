import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { getAllPinsByUsername, removePin} from "../../store/pins"
import logo from "../../images/logo.jpg"
import { getAllBoards } from "../../store/boards";


const DeletePinModal = ({pin}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const user = useSelector(state => state.session.user)

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(removePin(pin.id)).then(dispatch(getAllPinsByUsername(user?.username))).then(dispatch(getAllBoards(user.username))).then(dispatch(getAllPinsByUsername(user?.username))).then(closeModal());
        history.push(`/${user?.username}/profile`)
    }

    return (
        <>
            <img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
            <div className="delete container">
                <p className="delete title">Are you sure you want to delete {pin.name}?</p>
                <div className="delete button modal container">
                    <button className="delete button modal yes" onClick={handleDelete}>
                        Yes
                    </button>
                    <button className="delete button modal no" onClick={closeModal}>
                        No
                    </button>
                </div>
            </div>
        </>
    )
}

export default DeletePinModal;
