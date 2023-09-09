const cloneDeep = require("clone-deep")

/* Action Type Constants */
const GET_ALL_PINS = "pins/GET_ALL_PINS"

/* Action Creators */
const getPins = (pins) => ({
    type: GET_ALL_PINS,
    payload: pins
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
        default:
            return state
    }
}

export default pinsReducer;
