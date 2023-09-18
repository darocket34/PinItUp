import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteBoard } from "../../store/boards";
import logo from "../../images/logo.jpg"


const DeleteBoardModal = ({board}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const user = useSelector(state=> state.session.user)

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(deleteBoard(board.id)).then(closeModal());
        history.push(`/${user?.username}/profile`)
    }

    return (
        <>
            <img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
            <div className="delete container">
                <p className="delete title">Are you sure you want to delete {board.name}?</p>
                <div className="delete button container">
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

export default DeleteBoardModal;
