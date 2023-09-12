const cloneDeep = require("clone-deep")

/* Action Type Constants */
const GET_ALL_PINS = "pins/GET_ALL_PINS"
const CREATE_PIN = "pins/CREATE_PIN"
const GET_PIN = "pins/GET_PIN"

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

/* Thunks */
export const getAllPins = () => async (dispatch) => {
    const res = await fetch("/api/pins");
    if (res.ok) {
        const pins = await res.json();
        dispatch(getPins(pins));
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const getSinglePin = (pin) => async (dispatch) => {
    console.log("PIN", pin)
    const res = await fetch(`/api/pins/${pin}`, {
        method: "get"
    });
    if (res.ok) {
        const pinRes = await res.json();
        console.log(pinRes.pin)
        dispatch(getPin(pinRes.pin));
    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const createPin = (pin) => async (dispatch) => {
    console.log("STEP !", pin)
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
        default:
            return state
    }
}

export default pinsReducer;
