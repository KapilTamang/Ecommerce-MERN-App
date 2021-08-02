import {
	CREATE_ORDER_REQUEST,
	CREATE_ORDER_SUCCESS,
	CREATE_ORDER_FAIL,
	ALL_ORDERS_REQUEST,
	ALL_ORDERS_SUCCESS,
	ALL_ORDERS_FAIL,
	UPDATE_ORDER_REQUEST,
	UPDATE_ORDER_SUCCESS,
	UPDATE_ORDER_FAIL,
	DELETE_ORDER_REQUEST,
	DELETE_ORDER_SUCCESS,
	DELETE_ORDER_FAIL,
	MY_ORDERS_REQUEST,
	MY_ORDERS_SUCCESS,
	MY_ORDERS_FAIL,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_DETAILS_FAIL,
	CLEAR_ERRORS,
} from '../constants/orderConstants';
import axios from 'axios';

//Create New Order
export const createOrder = (order) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_ORDER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post('/api/v1/orders', order, config);

		dispatch({
			type: CREATE_ORDER_SUCCESS,
			payload: res.data.order,
		});
	} catch (error) {
		dispatch({
			type: CREATE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Get Curently Logged in User's Orders
export const getMyOrders =
	(keyword, currentPage, perPage) => async (dispatch) => {
		try {
			dispatch({
				type: MY_ORDERS_REQUEST,
			});

			const res = await axios.get(
				`/api/v1/order/me?keyword=${keyword}&page=${currentPage}&perPage=${perPage}`
			);

			dispatch({
				type: MY_ORDERS_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			dispatch({
				type: MY_ORDERS_FAIL,
				payload: error.response.data.message,
			});
		}
	};

//Get All Orders - ADMIN
export const getAllOrders =
	(keyword = '', currentPage, perPage) =>
	async (dispatch) => {
		try {
			dispatch({
				type: ALL_ORDERS_REQUEST,
			});

			const res = await axios.get(
				`/api/v1/admin/orders?keyword=${keyword}&page=${currentPage}&perPage=${perPage}`
			);

			dispatch({
				type: ALL_ORDERS_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			dispatch({
				type: ALL_ORDERS_FAIL,
				payload: error.response.data.message,
			});
		}
	};

//Get Single Order Details
export const getOrderDetails = (id) => async (dispatch) => {
	try {
		dispatch({
			type: ORDER_DETAILS_REQUEST,
		});

		const res = await axios.get(`/api/v1/orders/${id}`);

		dispatch({
			type: ORDER_DETAILS_SUCCESS,
			payload: res.data.order,
		});
	} catch (error) {
		dispatch({
			type: ORDER_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Update Order - ADMIN
export const updateOrder = (id, orderData) => async (dispatch) => {
	try {
		dispatch({
			type: UPDATE_ORDER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put(
			`/api/v1/admin/orders/${id}`,
			orderData,
			config
		);

		dispatch({
			type: UPDATE_ORDER_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Delete Order - ADMIN
export const deleteOrder = (id) => async (dispatch) => {
	try {
		dispatch({
			type: DELETE_ORDER_REQUEST,
		});

		const res = await axios.delete(`/api/v1/admin/orders/${id}`);

		dispatch({
			type: DELETE_ORDER_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};
