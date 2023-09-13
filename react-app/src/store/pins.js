const cloneDeep = require("clone-deep")

/* Action Type Constants */
const GET_ALL_PINS = "pins/GET_ALL_PINS"
const CREATE_PIN = "pins/CREATE_PIN"
const GET_PIN = "pins/GET_PIN"
const DELETE_PIN = "pins/DELETE_PIN"
const UPDATE_PIN = "pins/UPDATE_PIN"

/* Action Creators */
const getPins = (pins) => ({
    type: GET_ALL_PINS,
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

export const createPin = (pin) => async (dispatch) => {
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
            return pinRes.pin
        } else {
            const {errors} = await res.json();
            return errors;
        }
    } catch (err) {
        if (err) {
            let {error} = await err.json()
            return error
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
                newState.allPins[pin.id] = pin
            });
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
            return state
    }
}

export default pinsReducer;
