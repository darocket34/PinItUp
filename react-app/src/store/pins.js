const cloneDeep = require("clone-deep")

/* Action Type Constants */
const GET_ALL_PINS = "pins/GET_ALL_PINS"
const GET_ALL_PINS_BY_USER = "pins/GET_ALL_PINS_BY_USER"
const CREATE_PIN = "pins/CREATE_PIN"
const GET_PIN = "pins/GET_PIN"
const DELETE_PIN = "pins/DELETE_PIN"
const UPDATE_PIN = "pins/UPDATE_PIN"
const ADD_TO_BOARD = "pins/ADD_TO_BOARD"

/* Action Creators */
const getPins = (pins) => ({
    type: GET_ALL_PINS,
    payload: pins
})

const getPinsByUser = (pins) => ({
    type: GET_ALL_PINS_BY_USER,
    payload: pins
})

const getPin = (pin) => ({
    type: GET_PIN,
    pin
})

const addPin = (pin) => ({
    type: CREATE_PIN,
    pin
})

const updateSinglePin = (pin) => ({
    type: UPDATE_PIN,
    pin
})

const deletePin = (pin) => ({
    type: DELETE_PIN,
    pin
})



/* Thunks */
export const getAllPins = () => async (dispatch) => {
    const res = await fetch("/api/pins");
    if (res.ok) {
        const pins = await res.json();
        dispatch(getPins(pins));
        return pins;
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const getAllPinsByUsername = (username) => async (dispatch) => {
    const res = await fetch(`/api/pins/${username}/all`);
    if (res.ok) {
        const pins = await res.json();
        dispatch(getPinsByUser(pins));
        return pins;
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const getSinglePin = (pin) => async (dispatch) => {
    const res = await fetch(`/api/pins/${pin}`, {
        method: "get"
    });
    if (res.ok) {
        const pinRes = await res.json();
        dispatch(getPin(pinRes.pin));
        return pinRes;
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const createPin = (pin, boardId) => async (dispatch) => {
    console.log("PIN FE", boardId)
    const res = await fetch(`/api/pins/newpin`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pin),
    })
    if (res.ok) {
        const pin = await res.json();
        dispatch(addPin(pin));
        return pin;
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const updatePin = (pin) => async (dispatch) => {
    console.log("PIN", pin)
    try {
        const res = await fetch(`/api/pins/${pin.id}/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pin)
        })
        if (res.ok) {
            const pinRes = await res.json();
            dispatch(updateSinglePin(pinRes.pin));
            return pin
        } else {
            const {errors} = await res.json();
            return errors;
        }
    } catch (err) {
        if (err) {
            let {errors} = await err.json()
            return errors
        }
    }
}

export const removePin = (pin) => async (dispatch) => {
    const res = await fetch(`/api/pins/${pin}`, {
        method: "DELETE"
    })
    if (res.ok) {
        const pin = await res.json();
        dispatch(deletePin(pin));
        return pin
    } else {
        const {errors} = await res.json();
        console.log(errors)
        return errors;
    }
}

// export const getUser = (username) => async (dispatch) => {
//     const res = await fetch(`/api/users/${username}`)
//     if (res.ok) {
//         const user = await res.json();
//         return user
//     } else {
//         const {errors} = await res.json();
//         console.log(errors)
//         return errors;
//     }
// }

/* Reducer */
const pinsReducer = (
    state = {allPins: [], singlePin: null},
    action
) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case GET_ALL_PINS:
            newState.allPins = {};
            action.payload.pins.forEach(pin => {
                newState.allPins[pin.id] = pin;
            });
            return newState;
        case GET_ALL_PINS_BY_USER:
            newState.allPins = action.payload.pins;
            return newState;
        case CREATE_PIN:
            newState.allPins[action.pin.id] = action.pin;
            newState.singlePin = action.pin;
            return newState;
        case GET_PIN:
            newState.singlePin = action.pin;
            return newState;
        case UPDATE_PIN:
            newState.singlePin = action.pin;
            return newState;
        case DELETE_PIN:
            return newState;
        default:
            return state;
    }
}

export default pinsReducer;
