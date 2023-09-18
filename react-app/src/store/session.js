const cloneDeep = require("clone-deep")
// constants
const SET_USER = "session/SET_USER";
const GET_USER = "session/GET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const GET_CREATOR_ID = "session/GET_CREATOR_ID"
const GET_CREATOR_USERNAME = "session/GET_CREATOR_USERNAME"

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const followUser = (updatedUser) => ({
	type: GET_USER,
	updatedUser,
});

const unfollowUser = (updatedUser) => ({
	type: GET_USER,
	updatedUser,
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

const updateUser = (user) => ({
	type: GET_USER,
	user
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
		console.log(response)
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

export const signUp = (reqObj) => async (dispatch) => {
	const uploadForm = new FormData()
	uploadForm.append('name', JSON.stringify(reqObj.name))
	uploadForm.append('email', JSON.stringify(reqObj.email))
	uploadForm.append('username', JSON.stringify(reqObj.username))
	uploadForm.append('password', JSON.stringify(reqObj.password))
	uploadForm.append('url', reqObj.url)
	if (reqObj.birthday) uploadForm.append("birthday", JSON.stringify(reqObj.birthday))
	console.log("FE REQ", reqObj)
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		body: uploadForm
	});
	if (response.ok) {
		const data = await response.json();
		console.log("FE RES", response)
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		console.log("FE RES", response)
		return data;
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const followCurrUser = (followObj) => async (dispatch) => {
    const res = await fetch(`/api/users/follow/${followObj.creator}`, {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(followObj),
	})
    if (res.ok) {
        const updatedUser = await res.json();
		console.log("UPDTE", updatedUser)
		dispatch(followUser(updatedUser))
        return updatedUser;
	    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const unfollowCurrUser = (followObj) => async (dispatch) => {
    const res = await fetch(`/api/users/unfollow/${followObj.creator}`, {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(followObj),
	})
    if (res.ok) {
        const updatedUser = await res.json();
		console.log("UPDTE", updatedUser)
		dispatch(unfollowUser(updatedUser))
        return updatedUser;
	    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const getUserById = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`)
    if (res.ok) {
        const user = await res.json();
		dispatch(getCreatorById(user))
        return user;
	    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const getUserByUsername = (username) => async (dispatch) => {
    const res = await fetch(`/api/users/username/${username}`);
    if (res.ok) {
        const user = await res.json();
		dispatch(getCreatorByUsername(user))
        return user;
	    } else {
        const {errors} = await res.json();
        return errors;
    }
}

export const updateUserProfile = (updateObj) => async (dispatch) => {
	const uploadForm = new FormData()
	if (updateObj.url) uploadForm.append("url", updateObj.url)
	if (updateObj.text) uploadForm.append("text", JSON.stringify(updateObj.text))
	uploadForm.append("user", JSON.stringify(updateObj.user))
    const res = await fetch(`/api/users/${updateObj.user.username}/edit`, {
		method: "put",
		body: uploadForm,
	});
    if (res.ok) {
		const updatedUser = await res.json();
		dispatch(updateUser(updatedUser))
        return updatedUser;
	} else {
		const errors = await res.json();
        return errors;
	};
};

export default function reducer(state = initialState, action) {
	let newState = cloneDeep(state)
	switch (action.type) {
		case SET_USER:
			return {user: action.payload};
		case GET_USER:
			return {user: action.updatedUser};
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
	};
};
