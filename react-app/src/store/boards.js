const cloneDeep = require("clone-deep")

/* Action Type Constants */
const GET_ALL_BOARDS = "boards/GET_ALL_BOARDS"

/* Action Creators */
const getBoards = (boards) => ({
    type: GET_ALL_BOARDS,
    payload: boards
})

/* Thunks */
export const getAllBoards = (username) => async (dispatch) => {
    const res = await fetch(`/api/boards/${username}`);
    if (res.ok) {
        const boards = await res.json();
        dispatch(getBoards(boards));
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

/* Reducer */
const boardsReducer = (
    state = {allBoards: [], singleBoard: null},
    action
) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case GET_ALL_BOARDS:
            newState.allBoards = {};
            action.payload.boards.forEach(board => {
                newState.allBoards[board.id] = board
            });
            return newState;
        default:
            return state
    }
}

export default boardsReducer;
