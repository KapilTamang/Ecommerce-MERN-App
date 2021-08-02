import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CheckoutSteps from './CheckoutSteps';
import MetaData from '../layouts/MetaData';

const ConfirmOrder = ({ history }) => {
	const { cartItems, shippingInfo } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	//Calculate Order Prices
	const itemsPrice = cartItems.reduce(
		(acc, item) => acc + item.quantity * item.price,
		0
	);
	const shippingPrice = itemsPrice >= 200 ? 0 : 25;
	const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
	const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

	const proceedPaymentHandler = () => {
		const data = {
			itemsPrice: itemsPrice.toFixed(2),
			shippingPrice: shippingPrice.toFixed(2),
			taxPrice,
			totalPrice,
		};
		sessionStorage.setItem('orderInfo', JSON.stringify(data));

		history.push('/payment');
	};

	return (
		<Fragment>
			<MetaData title="Confirm Order" />
			<CheckoutSteps shipping confirmOrder />
			<div className="container container-fluid">
				<div className="row order-confirm d-flex justify-content-between my-4">
					<div
						className="col-12 col-lg-7 col-xl-7 order-confirm  shadow-lg py-4 px-4"
						style={{ borderRadius: '1rem' }}
					>
						<div className="mb-4">
							<h4>
								{' '}
								<i
									class="fas fa-shipping-fast"
									style={{ color: '#204060' }}
								></i>
								&nbsp; Shipping Info
							</h4>
						</div>
						<p>
							<b>Name : </b>
							{user && user.name}
						</p>
						<p>
							<b>Phone : </b>
							{shippingInfo.phoneNo}
						</p>
						<p className="mb-5">
							<b>Address : </b>
							{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country} `}
						</p>

						<span
							className="px-3 py-2"
							style={{
								backgroundColor: '#204060',
								color: 'white',
								fontSize: '0.9rem',
							}}
						>
							<i
								class="fas fa-cart-arrow-down"
								style={{ fontSize: '1rem' }}
							></i>
							&nbsp; CART
						</span>
						<span
							className="px-3 py-2"
							style={{
								backgroundColor: '#ffcc66',
								color: 'black',
								fontSize: '0.9rem',
							}}
						>
							<strong>{cartItems.length} item(s)</strong>
						</span>
						{cartItems.map((item) => (
							<Fragment>
								<hr className="mt-4" />
								<div className="cart-item my-1" key={item.product}>
									<div className="row">
										<div className="col-3 col-lg-3 text-center">
											<img
												src={item.image}
												alt="item.name"
												width="85"
												height="65"
											/>
										</div>
										<div className="col-4 col-lg-5 d-flex  align-items-center">
											<Link to={`/product/${item.product}`}>{item.name}</Link>
										</div>
										<div className="col-5 col-lg-4 mt-4 mt-lg-2 d-flex justify-content-center align-items-center">
											<p>
												{item.quantity} &#215; {item.price} ={' '}
												<b>${(item.quantity * item.price).toFixed(2)}</b>
											</p>
										</div>
									</div>
								</div>
								<hr />
							</Fragment>
						))}
					</div>
					<div className="col-12 col-lg-4 col-xl-4 my-2">
						<div id="order_summary" className="shadow-lg">
							<h4>Order Summary</h4>
							<hr />
							<p>
								Subtotal:{' '}
								<span className="order-summary-values">${itemsPrice}</span>
							</p>
							<p>
								Shipping:{' '}
								<span className="order-summary-values">${shippingPrice}</span>
							</p>
							<p>
								Tax: <span className="order-summary-values">${taxPrice}</span>
							</p>
							<hr />
							<p>
								Total:{' '}
								<span className="order-summary-values">${totalPrice}</span>
							</p>
							<hr />
							<button
								className="btn btn-yellow w-100 mt-3"
								onClick={proceedPaymentHandler}
							>
								Proceed to Payment
							</button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ConfirmOrder;
