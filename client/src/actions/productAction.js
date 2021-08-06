import axios from 'axios';
import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	ADMIN_PRODUCTS_REQUEST,
	ADMIN_PRODUCTS_SUCCESS,
	ADMIN_PRODUCTS_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	NEW_PRODUCT_REQUEST,
	NEW_PRODUCT_SUCCESS,
	NEW_PRODUCT_FAIL,
	UPDATE_PRODUCT_REQUEST,
	UPDATE_PRODUCT_SUCCESS,
	UPDATE_PRODUCT_FAIL,
	DELETE_PRODUCT_REQUEST,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAIL,
	NEW_REVIEW_REQUEST,
	NEW_REVIEW_SUCCESS,
	NEW_REVIEW_FAIL,
	GET_REVIEWS_REQUEST,
	GET_REVIEWS_SUCCESS,
	GET_REVIEWS_FAIL,
	DELETE_REVIEW_REQUEST,
	DELETE_REVIEW_SUCCESS,
	DELETE_REVIEW_FAIL,
	CLEAR_ERRORS,
} from '../constants/productConstants';

//Get All Products
export const getProducts =
	(keyword = '', currentPage = 1, price, category, rating = 0) =>
	async (dispatch) => {
		try {
			dispatch({
				type: ALL_PRODUCTS_REQUEST,
			});

			let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;

			if (category) {
				link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`;
			}

			const res = await axios.get(link);

			dispatch({
				type: ALL_PRODUCTS_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			dispatch({
				type: ALL_PRODUCTS_FAIL,
				payload: error.response.data.message,
			});
		}
	};

//Get All Admin Products
export const getAdminProducts =
	(keyword = '', currentPage, perPage) =>
	async (dispatch) => {
		try {
			dispatch({
				type: ADMIN_PRODUCTS_REQUEST,
			});

			const res = await axios.get(
				`/api/v1/admin/products?keyword=${keyword}&page=${currentPage}&perPage=${perPage}`
			);

			dispatch({
				type: ADMIN_PRODUCTS_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			dispatch({
				type: ADMIN_PRODUCTS_FAIL,
				payload: error.response.data.message,
			});
		}
	};

//Get Sinlge Product Details
export const getProductDetails = (id) => async (dispatch) => {
	try {
		dispatch({
			type: PRODUCT_DETAILS_REQUEST,
		});

		const res = await axios.get(`/api/v1/products/${id}`);

		dispatch({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Create New Product
export const createNewProduct = (product) => async (dispatch) => {
	try {
		dispatch({
			type: NEW_PRODUCT_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post('/api/v1/products', product, config);

		dispatch({
			type: NEW_PRODUCT_SUCCESS,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: NEW_PRODUCT_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Update Product
export const updateProduct = (id, productData) => async (dispatch) => {
	try {
		dispatch({
			type: UPDATE_PRODUCT_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put(`/api/v1/products/${id}`, productData, config);

		dispatch({
			type: UPDATE_PRODUCT_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_PRODUCT_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Delete Product
export const deleteProduct = (id) => async (dispatch) => {
	try {
		dispatch({
			type: DELETE_PRODUCT_REQUEST,
		});

		const res = await axios.delete(`/api/v1/products/${id}`);

		dispatch({
			type: DELETE_PRODUCT_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_PRODUCT_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Create New Review
export const createNewReview = (reviewData) => async (dispatch) => {
	try {
		dispatch({
			type: NEW_REVIEW_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put('/api/v1/reviews', reviewData, config);

		dispatch({
			type: NEW_REVIEW_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: NEW_REVIEW_FAIL,
		});
	}
};

//Get Product Reviews
export const getProductReviews =
	(id, keyword, currentPage, perPage) => async (dispatch) => {
		try {
			dispatch({
				type: GET_REVIEWS_REQUEST,
			});

			const res = await axios.get(
				`/api/v1/reviews?id=${id}&keyword=${keyword}&page=${currentPage}&perPage=${perPage}`
			);

			dispatch({
				type: GET_REVIEWS_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			dispatch({
				type: GET_REVIEWS_FAIL,
				payload: error.response.data.message,
			});
		}
	};

//Delete Review
export const deleteReview = (id, productId) => async (dispatch) => {
	try {
		dispatch({
			type: DELETE_REVIEW_REQUEST,
		});

		const res = await axios.delete(
			`/api/v1/reviews?productId=${productId}&id=${id}`
		);

		dispatch({
			type: DELETE_REVIEW_SUCCESS,
			payload: res.data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_REVIEW_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Clear Errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};
