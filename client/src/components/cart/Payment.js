import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { createOrder, clearErrors } from '../../actions/orderAction';
import { clearCart } from '../../actions/cartAction';
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
} from '@stripe/react-stripe-js';
import MetaData from '../layouts/MetaData';
import CheckoutSteps from '../cart/CheckoutSteps';
import axios from 'axios';
import FormLoader from '../layouts/FormLoader';

const options = {
	style: {
		base: {
			fontSize: '16px',
		},
	},
	invalid: {
		color: '#9e2146',
	},
};

const Payment = ({ history }) => {
	const [loading, setLoading] = useState(false);

	const alert = useAlert();

	const dispatch = useDispatch();

	const stripe = useStripe();

	const elements = useElements();

	const { user } = useSelector((state) => state.auth);

	const { cartItems, shippingInfo } = useSelector((state) => state.cart);

	const { error } = useSelector((state) => state.newOrder);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
		//eslint-disable-next-line
	}, [dispatch, alert, error]);

	const order = {
		orderItems: cartItems,
		shippingInfo: shippingInfo,
	};

	const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

	if (orderInfo) {
		order.itemsPrice = orderInfo.itemsPrice;
		order.shippingPrice = orderInfo.shippingPrice;
		order.taxPrice = orderInfo.taxPrice;
		order.totalPrice = orderInfo.totalPrice;
	}

	const paymentData = {
		amount: Math.round(orderInfo.totalPrice * 100),
	};

	const paymentHandler = async (e) => {
		e.preventDefault();

		setLoading(true);

		let res;

		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			res = await axios.post('/api/v1/payment/process', paymentData, config);

			const client_secret = res.data.client_secret;

			if (!stripe || !elements) {
				return;
			}

			const result = await stripe.confirmCardPayment(client_secret, {
				payment_method: {
					card: elements.getElement(CardNumberElement),
					billing_details: {
						name: user.name,
						email: user.email,
					},
				},
			});

			if (result.error) {
				setLoading(false);
				alert.error(result.error.message);
			} else {
				//The Payment is Processed or Not
				if (result.paymentIntent.status === 'succeeded') {
					setLoading(false);

					order.paymentInfo = {
						id: result.paymentIntent.id,
						status: result.paymentIntent.status,
					};

					dispatch(createOrder(order));

					dispatch(clearCart());

					history.push('orders/success');
				}
			}
		} catch (error) {
			setLoading(false);
			alert.error(error.response.data.message);
		}
	};

	return (
		<Fragment>
			<MetaData title="Payment" />
			<CheckoutSteps shipping confirmOrder payment />
			<div className="row wrapper my-4">
				<div className="col-10 col-md-7 col-lg-5">
					<form className="shadow-lg mb-4" onSubmit={paymentHandler}>
						{loading && <FormLoader />}
						<p
							className="mb-3 text-center"
							style={{ color: '#204060', fontSize: '1.5rem' }}
						>
							Card Info
						</p>
						<div className="mb-3">
							<label htmlFor="card_num_field" className="form-label">
								Card Number
							</label>
							<CardNumberElement
								type="text"
								className="form-control"
								id="card_num_field"
								options={options}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="card_exp_field" className="form-label">
								Card Expiry
							</label>
							<CardExpiryElement
								type="text"
								className="form-control"
								id="card_exp_field"
								options={options}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="card_cvc_field" className="form-label">
								Card CVC
							</label>
							<CardCvcElement
								type="text"
								className="form-control"
								id="card_cvc_field"
								options={options}
							/>
						</div>
						<button type="submit" className="btn btn-yellow w-100 py-2">
							Pay -&nbsp; <strong>${orderInfo.totalPrice}</strong>
						</button>
					</form>
				</div>
			</div>
		</Fragment>
	);
};

export default Payment;
