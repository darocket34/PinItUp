import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteBoard } from "../../store/boards";

const DeleteBoardModal = ({board}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const user = useSelector(state=> state.session.user)

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(deleteBoard(board.id)).then(closeModal());
        history.push(`/${user.id}/profile`)
    }

    return (
        <>
            <button onClick={handleDelete}>Delete</button>
        </>
    )
}

export default DeleteBoardModal;
