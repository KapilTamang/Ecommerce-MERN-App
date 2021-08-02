import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layouts/MetaData';
import NotFound from '../layouts/NotFound';
import {
	addItemToCart,
	removeItemFromCart,
	clearCart,
} from './../../actions/cartAction';

const Cart = ({ history }) => {
	const alert = useAlert();

	const dispatch = useDispatch();

	const { cartItems } = useSelector((state) => state.cart);

	const removeCartItemHanlder = (id) => {
		dispatch(removeItemFromCart(id));

		alert.success('Item Removed From Cart');
	};

	const increaseQty = (id, quantity, stock) => {
		const newQty = quantity + 1;

		if (newQty > stock) return;

		dispatch(addItemToCart(id, newQty));
	};

	const decreaseQty = (id, quantity) => {
		const newQty = quantity - 1;

		if (newQty < 1) return;

		dispatch(addItemToCart(id, newQty));
	};

	const checkOutHandler = () => {
		history.push('/login?redirect=shipping');
	};

	const clearCartHandler = () => {
		dispatch(clearCart());
		history.push('/cart');
		alert.success('Cart items cleared');
	};

	return (
		<Fragment>
			<MetaData title="Cart" />
			{cartItems.length === 0 ? (
				<Fragment>
					{/* <div className="row justify-content-center">
						<div className="col-6 mt-5 text-center">
							<img
								src="/images/empty_cart.svg"
								alt=""
								className="mt-4 mb-1 img-fluid d-block mx-auto"
								width="550"
							/>
							<h3>Your Cart is currently empty.</h3>
							<Link to="/" className="btn btn-yellow mt-3">
								Shop Now
							</Link>
						</div>
					</div> */}
					<NotFound
						image={'empty_cart'}
						msg={'Your Cart is Currently Empty.'}
					/>
					<div className="d-flex justify-content-center">
						<Link to="/" className="text-center btn btn-yellow">
							Shop Now
						</Link>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<div className="container container-fluid my-5">
						<h6>
							<span
								className="px-3 py-2"
								style={{
									backgroundColor: '#204060',
									color: 'white',
								}}
							>
								<i
									className="fas fa-cart-arrow-down"
									style={{ fontSize: '1.2rem' }}
								></i>
								&nbsp; CART
							</span>
							<span
								className="px-3 py-2"
								style={{
									backgroundColor: '#ffcc66',
									color: 'black',
								}}
							>
								<strong>{cartItems.length} Item(s)</strong>
							</span>
						</h6>
						<div className="row cart-container d-flex justify-content-between mt-4 mb-5">
							<div
								className="col-12 col-lg-7 col-xl-8 cart-details shadow-lg py-4 px-4"
								style={{ borderRadius: '1rem' }}
							>
								{cartItems.map((item) => (
									<Fragment>
										<hr />
										<div className="cart-item" key={item.product}>
											<div className="row py-0">
												<div className="col-4 col-md-3 col-lg-3">
													<img
														src={item.image}
														alt={item.name}
														height="65"
														width="85"
													/>
												</div>
												<div className="col-7 col-md-6 col-lg-3 d-flex  align-items-center">
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</div>
												<div className="col-4 col-md-2 col-lg-1 mt-4 mt-lg-4">
													<p
														className="cart_item_price text-center"
														style={{ color: '#204060' }}
													>
														<strong>${item.price}</strong>
													</p>
												</div>
												<div className="col-4 col-md-9 col-lg-4 mt-4 mt-lg-4">
													<div className="stockCounter d-flex justify-content-center align-items-center">
														<span
															className="btn btn-danger minus"
															onClick={() =>
																decreaseQty(item.product, item.quantity)
															}
														>
															-
														</span>
														<input
															type="number"
															className="form-control count d-inline"
															value={item.quantity}
															readOnly
														/>
														<span
															className="btn btn-success plus"
															onClick={() =>
																increaseQty(
																	item.product,
																	item.quantity,
																	item.stock
																)
															}
														>
															+
														</span>
													</div>
												</div>
												<div className="col-4 col-md-2 col-lg-1 mt-4 mt-lg-4 text-center">
													<i
														id="delete_cart_item"
														className="fas fa-trash-alt btn btn-danger"
														onClick={() => removeCartItemHanlder(item.product)}
													></i>
												</div>
											</div>
										</div>
										<hr />
									</Fragment>
								))}
								<button
									className="btn btn-blue float-end"
									onClick={clearCartHandler}
								>
									<i class="fas fa-trash-alt"></i>&nbsp;&nbsp; Clear Cart
								</button>
							</div>
							<div className="col-12 col-lg-4 col-xl-3 my-3">
								<div id="order_summary" className="shadow-lg">
									<h4>Order Summary</h4>
									<hr />
									<p>
										Subtotal:{' '}
										<span className="order-summary-values">
											{cartItems.reduce(
												(accu, item) => accu + item.quantity,
												0
											)}{' '}
											(units)
										</span>
									</p>
									<p>
										Est. total:{' '}
										<span className="order-summary-values">
											$
											{cartItems
												.reduce(
													(accu, item) => accu + item.quantity * item.price,
													0
												)
												.toFixed(2)}
										</span>
									</p>
									<hr />
									<button
										className="btn btn-yellow w-100 mt-3"
										onClick={checkOutHandler}
									>
										Checkout
									</button>
								</div>
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Cart;
