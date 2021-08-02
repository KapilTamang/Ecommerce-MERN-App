import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
	productsReducer,
	productDetailsReducer,
	productReducer,
	newReviewReducer,
	newProductReducer,
	productReviewsReducer,
	reviewReducer,
} from './reducers/productReducer';

import {
	authReducer,
	userReducer,
	forgotPasswordReducer,
	allUsersReducer,
	userDetailsReducer,
} from './reducers/userReducer';

import {
	newOrderReducer,
	myOrdersReducer,
	orderDetailsReducer,
	allOrdersReducer,
	orderReducer,
} from './reducers/orderReducer';

import { cartReducer } from './reducers/cartReducer';

const middleware = [thunk];

const reducer = combineReducers({
	products: productsReducer,
	productDetails: productDetailsReducer,
	product: productReducer,
	newProduct: newProductReducer,
	productReviews: productReviewsReducer,
	review: reviewReducer,
	auth: authReducer,
	user: userReducer,
	userDetails: userDetailsReducer,
	allUsers: allUsersReducer,
	forgotPassword: forgotPasswordReducer,
	cart: cartReducer,
	newOrder: newOrderReducer,
	myOrders: myOrdersReducer,
	orderDetails: orderDetailsReducer,
	allOrders: allOrdersReducer,
	order: orderReducer,
	newReview: newReviewReducer,
});

let initialState = {
	cart: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems'))
			: [],
		shippingInfo: localStorage.getItem('shippingInfo')
			? JSON.parse(localStorage.getItem('shippingInfo'))
			: [],
	},
};

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
