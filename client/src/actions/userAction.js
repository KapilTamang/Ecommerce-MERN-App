import axios from 'axios';
import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REGISTER_USER_REQUEST,
	REGISTER_USER_SUCCESS,
	REGISTER_USER_FAIL,
	LOAD_USER_REQUEST,
	LOAD_USER_SUCCESS,
	LOAD_USER_FAIL,
	UPDATE_PROFILE_REQUEST,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_FAIL,
	UPDATE_PASSWORD_REQUEST,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_FAIL,
	LOGOUT_SUCCESS,
	LOGOUT_FAIL,
	FORGOT_PASSWORD_FAIL,
	FORGOT_PASSWORD_REQUEST,
	FORGOT_PASSWORD_SUCCESS,
	RESET_PASSWORD_FAIL,
	RESET_PASSWORD_REQUEST,
	RESET_PASSWORD_SUCCESS,
	EMAIL_VERIFICATION_REQUEST,
	EMAIL_VERIFICATION_SUCCESS,
	EMAIL_VERIFICATION_FAIL,
	VERIFY_EMAIL_REQUEST,
	VERIFY_EMAIL_SUCCESS,
	VERIFY_EMAIL_FAIL,
	ALL_USERS_REQUEST,
	ALL_USERS_SUCCESS,
	ALL_USERS_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_DETAILS_FAIL,
	UPDATE_USER_REQUEST,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAIL,
	DELETE_USER_REQUEST,
	DELETE_USER_SUCCESS,
	DELETE_USER_FAIL,
	CLEAR_SUCCESS_MESSAGE,
	CLEAR_ERRORS,
} from '../constants/userConstants';

//Login User
export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: LOGIN_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post('/api/v1/login', { email, password }, config);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data.user,
		});
	} catch (error) {
		dispatch({
			type: LOGIN_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Register User
export const register = (user, avatar) => async (dispatch) => {
	try {
		dispatch({
			type: REGISTER_USER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post('/api/v1/register', { user, avatar }, config);

		dispatch({
			type: REGISTER_USER_SUCCESS,
			payload: res.data.user,
		});
	} catch (error) {
		dispatch({
			type: REGISTER_USER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Load User
export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: LOAD_USER_REQUEST,
		});

		const res = await axios.get(`/api/v1/me`);

		dispatch({
			type: LOAD_USER_SUCCESS,
			payload: res.data.user,
		});
	} catch (error) {
		dispatch({
			type: LOAD_USER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Update Profile
export const updateProfile = (userData) => async (dispatch) => {
	try {
		dispatch({
			type: UPDATE_PROFILE_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		const res = await axios.put('/api/v1/me/update', userData, config);

		dispatch({
			type: UPDATE_PROFILE_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_PROFILE_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Update Password
export const updatePassword = (passwords) => async (dispatch) => {
	try {
		dispatch({
			type: UPDATE_PASSWORD_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put('/api/v1/password/update', passwords, config);

		dispatch({
			type: UPDATE_PASSWORD_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_PASSWORD_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
	try {
		dispatch({
			type: FORGOT_PASSWORD_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post('/api/v1/password/forgot', email, config);

		dispatch({
			type: FORGOT_PASSWORD_SUCCESS,
			payload: res.data.message,
		});
	} catch (error) {
		dispatch({
			type: FORGOT_PASSWORD_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
	try {
		dispatch({
			type: RESET_PASSWORD_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put(
			`/api/v1/password/reset/${token}`,
			passwords,
			config
		);

		dispatch({
			type: RESET_PASSWORD_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: RESET_PASSWORD_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Email Verification Request
export const emailVerification = (email) => async (dispatch) => {
	try {
		dispatch({
			type: EMAIL_VERIFICATION_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post('/api/v1/email/verify', email, config);

		dispatch({
			type: EMAIL_VERIFICATION_SUCCESS,
			payload: res.data.message,
		});
	} catch (error) {
		dispatch({
			type: EMAIL_VERIFICATION_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Verify Email
export const verifyEmail = (token) => async (dispatch) => {
	try {
		dispatch({
			type: VERIFY_EMAIL_REQUEST,
		});

		const res = await axios.get(`/api/v1/email/verify/${token}`);

		dispatch({
			type: VERIFY_EMAIL_SUCCESS,
			payload: res.data.message,
		});
	} catch (error) {
		dispatch({
			type: VERIFY_EMAIL_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Logout User
export const logout = () => async (dispatch) => {
	try {
		await axios.get('/api/v1/logout');

		dispatch({
			type: LOGOUT_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: LOGOUT_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Get All Users - ADMIN
export const getAllUsers =
	(keyword = '', currentPage, perPage) =>
	async (dispatch) => {
		try {
			dispatch({
				type: ALL_USERS_REQUEST,
			});

			const res = await axios.get(
				`/api/v1/admin/users?keyword=${keyword}&page=${currentPage}&perPage=${perPage}`
			);

			dispatch({
				type: ALL_USERS_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			dispatch({
				type: ALL_USERS_FAIL,
				payload: error.response.data.message,
			});
		}
	};

//Get User Details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		});

		const res = await axios.get(`/api/v1/admin/users/${id}`);

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: res.data.user,
		});
	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Update User - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
	try {
		dispatch({
			type: UPDATE_USER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'applicaton/json',
			},
		};

		const res = await axios.put(`/api/v1/admin/users/${id}`, userData, config);

		dispatch({
			type: UPDATE_USER_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_USER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Delete User - ADMIN
export const deleteUser = (id) => async (dispatch) => {
	try {
		dispatch({
			type: DELETE_USER_REQUEST,
		});

		const res = await axios.delete(`/api/v1/admin/users/${id}`);

		dispatch({
			type: DELETE_USER_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_USER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Clear Success Message
export const clearSuccessMessage = () => async (dispatch) => {
	dispatch({
		type: CLEAR_SUCCESS_MESSAGE,
	});
};

//Clear Errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};
