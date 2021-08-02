import axios from 'axios';
import {
	ADD_ITEM_TO_CART,
	REMOVE_ITEM_FROM_CART,
	CLEAR_CART,
	SHIPPING_INFO,
} from '../constants/cartConstants';

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
	const res = await axios.get(`/api/v1/products/${id}`);

	dispatch({
		type: ADD_ITEM_TO_CART,
		payload: {
			product: res.data.product._id,
			name: res.data.product.name,
			price: res.data.product.price,
			image: res.data.product.images[0].url,
			stock: res.data.product.stock,
			quantity,
		},
	});

	localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeItemFromCart = (id) => async (dispatch, getState) => {
	dispatch({
		type: REMOVE_ITEM_FROM_CART,
		payload: id,
	});

	localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch) => {
	dispatch({
		type: SHIPPING_INFO,
		payload: data,
	});

	localStorage.setItem('shippingInfo', JSON.stringify(data));
};

export const clearCart = () => async (dispatch) => {
	dispatch({
		type: CLEAR_CART,
	});

	localStorage.removeItem('cartItems');
};
