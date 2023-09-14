const cloneDeep = require("clone-deep")

/* Action Type Constants */
const GET_ALL_BOARDS = "boards/GET_ALL_BOARDS"
const CREATE_BOARD = "boards/CREATE_BOARD"
const GET_BOARD = "boards/GET_BOARD"
const DELETE_BOARD = "boards/DELETE_BOARD"
const UPDATE_BOARD = "boards/UPDATE_BOARD"
const ADD_TO_BOARD = "pins/ADD_TO_BOARD"

/* Action Creators */
const getBoards = (boards) => ({
    type: GET_ALL_BOARDS,
    payload: boards
})

const getSingleBoard = (board) => ({
    type: GET_BOARD,
    board
})

const updateSingleBoard = (board) => ({
    type: UPDATE_BOARD,
    board
})

const addBoard = (board) => ({
    type: CREATE_BOARD,
    board
})

const removeBoard = (board) => ({
    type: DELETE_BOARD,
    board
})

const addToBoard = (board) => ({
    type: ADD_TO_BOARD,
    board
})


/* Thunks */
export const getAllBoards = (username) => async (dispatch) => {
    const res = await fetch(`/api/boards/${username}/all`);
    if (res.ok) {
        const boards = await res.json();
        dispatch(getBoards(boards));
        console.log(boards)
        return boards
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const getBoard = (id) => async (dispatch) => {
    const res = await fetch(`/api/boards/${id}`);
    if (res.ok) {
        const board = await res.json();
        dispatch(getSingleBoard(board));
        return board;
    } else {
        const {errors} = await res.json();
        console.log(errors)
        return errors;
    }
}

export const createBoard = (board) => async (dispatch) => {
    const res = await fetch(`/api/boards/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(board),
    });
    if (res.ok) {
        const board = await res.json();
        dispatch(addBoard(board));
        return board;
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const updateBoard = (board) => async (dispatch) => {

    try {
        const res = await fetch(`/api/boards/${board.id}/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(board)
        })
        if (res.ok) {
            const boardRes = await res.json();
            dispatch(updateSingleBoard(boardRes));
            return boardRes;
        } else {
            const {errors} = await res.json();
            return errors;
        }
    } catch (err) {
        console.log("ERROR THUINK", err)
        if (err) {
            return err
        }
    }
}

export const addPinToBoard = (pin, board) => async (dispatch) => {
    console.log("FRONT END", pin,board)
    const res = await fetch(`/api/boards/${board.id}/addpin`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({pin,board})
    })
    if (res.ok) {
        const board = await res.json();
        dispatch(addToBoard(board));
        return board;
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const deleteBoard = (boardId) => async (dispatch) => {
    const res = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        const board = await res.json();
        dispatch(removeBoard(board));
        return board;
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
        case CREATE_BOARD:
            newState.allBoards[action.board.id] = action.board
            newState.singleBoard = action.board
            return newState;
        case GET_BOARD:
            newState.singleBoard = action.board
            return newState;
        case UPDATE_BOARD:
            newState.singleBoard = action.board
            return newState;
        case ADD_TO_BOARD:
            newState.allBoards[action.board.id] = action.board
            return newState;
        case DELETE_BOARD:
            return newState;
        default:
            return state
    }
}

export default boardsReducer;
