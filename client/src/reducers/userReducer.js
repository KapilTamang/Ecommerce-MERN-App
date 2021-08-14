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
	LOGOUT_SUCCESS,
	LOGOUT_FAIL,
	UPDATE_PROFILE_REQUEST,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_RESET,
	UPDATE_PROFILE_FAIL,
	UPDATE_PASSWORD_REQUEST,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_RESET,
	UPDATE_PASSWORD_FAIL,
	FORGOT_PASSWORD_REQUEST,
	FORGOT_PASSWORD_SUCCESS,
	FORGOT_PASSWORD_FAIL,
	RESET_PASSWORD_REQUEST,
	RESET_PASSWORD_SUCCESS,
	RESET_PASSWORD_FAIL,
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
	UPDATE_USER_RESET,
	DELETE_USER_REQUEST,
	DELETE_USER_SUCCESS,
	DELETE_USER_FAIL,
	DELETE_USER_RESET,
	CLEAR_SUCCESS_MESSAGE,
	CLEAR_ERRORS,
} from '../constants/userConstants';

export const authReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case LOGIN_REQUEST:
		case REGISTER_USER_REQUEST:
		case LOAD_USER_REQUEST: {
			return {
				loading: true,
				isAuthenticated: false,
			};
		}

		case REGISTER_USER_SUCCESS: {
			return {
				...state,
				loading: false,
				user: action.payload,
				message: 'Registration successful. Email verification has been sent',
				isAuthenticated: true,
			};
		}

		case LOGIN_SUCCESS: {
			return {
				...state,
				loading: false,
				user: action.payload,
				message: 'Login Successful',
				isAuthenticated: true,
			};
		}

		case LOAD_USER_SUCCESS: {
			return {
				...state,
				loading: false,
				user: action.payload,
				isAuthenticated: true,
			};
		}

		case LOGIN_FAIL:
		case REGISTER_USER_FAIL: {
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				user: null,
				error: action.payload,
			};
		}

		case LOAD_USER_FAIL: {
			return {
				loading: false,
				isAuthenticated: false,
				user: null,
				error: action.payload,
			};
		}

		case LOGOUT_SUCCESS: {
			return {
				loading: false,
				isAuthenticated: false,
				user: null,
			};
		}

		case LOGOUT_FAIL: {
			return {
				...state,
				error: action.payload,
			};
		}

		case CLEAR_SUCCESS_MESSAGE: {
			return {
				...state,
				message: null,
			};
		}

		case CLEAR_ERRORS: {
			return {
				...state,
				error: null,
			};
		}

		default:
			return state;
	}
};

export const userReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_PROFILE_REQUEST:
		case UPDATE_PASSWORD_REQUEST:
		case UPDATE_USER_REQUEST:
		case DELETE_USER_REQUEST: {
			return {
				...state,
				loading: true,
			};
		}

		case UPDATE_PROFILE_SUCCESS:
		case UPDATE_PASSWORD_SUCCESS:
		case UPDATE_USER_SUCCESS: {
			return {
				...state,
				loading: false,
				isUpdated: action.payload,
			};
		}

		case DELETE_USER_SUCCESS: {
			return {
				...state,
				loading: false,
				isDeleted: action.payload,
			};
		}

		case UPDATE_PROFILE_RESET:
		case UPDATE_PASSWORD_RESET:
		case UPDATE_USER_RESET: {
			return {
				...state,
				isUpdated: false,
			};
		}

		case DELETE_USER_RESET: {
			return {
				...state,
				isDeleted: false,
			};
		}

		case UPDATE_PROFILE_FAIL:
		case UPDATE_PASSWORD_FAIL:
		case UPDATE_USER_FAIL:
		case DELETE_USER_FAIL: {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}

		case CLEAR_ERRORS: {
			return {
				...state,
				error: null,
			};
		}

		default:
			return state;
	}
};

export const forgotPasswordReducer = (state = {}, action) => {
	switch (action.type) {
		case FORGOT_PASSWORD_REQUEST:
		case RESET_PASSWORD_REQUEST: {
			return {
				...state,
				loading: true,
				error: null,
			};
		}

		case FORGOT_PASSWORD_SUCCESS: {
			return {
				...state,
				loading: false,
				message: action.payload,
			};
		}

		case RESET_PASSWORD_SUCCESS: {
			return {
				...state,
				success: action.payload,
			};
		}

		case FORGOT_PASSWORD_FAIL:
		case RESET_PASSWORD_FAIL: {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}

		case CLEAR_ERRORS: {
			return {
				...state,
				error: null,
			};
		}

		default:
			return state;
	}
};

export const emailVerificationReducer = (state = {}, action) => {
	switch (action.type) {
		case EMAIL_VERIFICATION_REQUEST:
		case VERIFY_EMAIL_REQUEST: {
			return {
				...state,
				loading: true,
			};
		}

		case EMAIL_VERIFICATION_SUCCESS:
		case VERIFY_EMAIL_SUCCESS: {
			return {
				...state,
				loading: false,
				message: action.payload,
			};
		}

		case EMAIL_VERIFICATION_FAIL:
		case VERIFY_EMAIL_FAIL: {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}

		case CLEAR_SUCCESS_MESSAGE: {
			return {
				...state,
				message: null,
			};
		}

		case CLEAR_ERRORS: {
			return {
				...state,
				error: null,
			};
		}

		default:
			return state;
	}
};

export const allUsersReducer = (state = { users: [] }, action) => {
	switch (action.type) {
		case ALL_USERS_REQUEST: {
			return {
				loading: true,
			};
		}

		case ALL_USERS_SUCCESS: {
			return {
				loading: false,
				users: action.payload.users,
				usersCount: action.payload.usersCount,
				resPerPage: action.payload.resPerPage,
				filteredUsersCount: action.payload.filteredUsersCount,
			};
		}

		case ALL_USERS_FAIL: {
			return {
				loading: false,
				error: action.payload,
			};
		}

		case CLEAR_ERRORS: {
			return {
				...state,
				error: null,
			};
		}

		default:
			return state;
	}
};

export const userDetailsReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case USER_DETAILS_REQUEST: {
			return {
				...state,
				loading: true,
			};
		}

		case USER_DETAILS_SUCCESS: {
			return {
				...state,
				loading: false,
				user: action.payload,
			};
		}

		case USER_DETAILS_FAIL: {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}

		case CLEAR_ERRORS: {
			return {
				...state,
				error: null,
			};
		}

		default:
			return state;
	}
};
