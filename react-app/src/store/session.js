const cloneDeep = require("clone-deep")
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const GET_CREATOR_ID = "session/GET_CREATOR_ID"
const GET_CREATOR_USERNAME = "session/GET_CREATOR_USERNAME"

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const getCreatorById = (creator) => ({
	type: GET_CREATOR_ID,
	creator
})

const getCreatorByUsername = (creator) => ({
	type: GET_CREATOR_USERNAME,
	creator
})

const initialState = { user: null, creator: null };

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (username, email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const getUserById = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`)
    if (res.ok) {
        const user = await res.json();
		console.log("USER", user)
		dispatch(getCreatorById(user))
        return user;
	    } else {
        const {errors} = await res.json();
        console.log(errors)
        return errors;
    }
}

export const getUserByUsername = (username) => async (dispatch) => {
    const res = await fetch(`/api/users/username/${username}`)
    if (res.ok) {
        const user = await res.json();
		console.log("USER", user)
		dispatch(getCreatorByUsername(user))
        return user;
	    } else {
        const {errors} = await res.json();
        console.log(errors)
        return errors;
    }
}

export default function reducer(state = initialState, action) {
	let newState = cloneDeep(state)
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		case GET_CREATOR_ID:
			newState.creator = action.creator
			return newState;
		case GET_CREATOR_USERNAME:
			newState.creator = action.creator
			return newState;
		default:
			return state;
	}
}
