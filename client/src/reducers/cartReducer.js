import {
	ADD_ITEM_TO_CART,
	REMOVE_ITEM_FROM_CART,
	CLEAR_CART,
	SHIPPING_INFO,
} from '../constants/cartConstants';

export const cartReducer = (
	state = { cartItems: [], shippingInfo: {} },
	action
) => {
	switch (action.type) {
		case ADD_ITEM_TO_CART: {
			const item = action.payload;

			const isItemExist = state.cartItems.find(
				(i) => i.product === item.product
			);

			if (isItemExist) {
				return {
					...state,
					cartItems: state.cartItems.map((i) =>
						i.product === isItemExist.product ? item : i
					),
				};
			} else {
				return {
					...state,
					cartItems: [...state.cartItems, item],
				};
			}
		}

		case REMOVE_ITEM_FROM_CART: {
			return {
				...state,
				cartItems: state.cartItems.filter((i) => i.product !== action.payload),
			};
		}

		case SHIPPING_INFO: {
			return {
				...state,
				shippingInfo: action.payload,
			};
		}

		case CLEAR_CART: {
			return {
				...state,
				cartItems: [],
			};
		}

		default:
			return state;
	}
};
