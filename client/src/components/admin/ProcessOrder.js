import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import Loader from '../layouts/Loader';
import ProcessLoader from '../layouts/ProcessLoader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	getOrderDetails,
	updateOrder,
	clearErrors,
} from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';

const ProcessOrder = ({ match }) => {
	const [status, setStatus] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, order = {} } = useSelector((state) => state.orderDetails);

	const {
		shippingInfo,
		paymentInfo,
		orderItems,
		user,
		totalPrice,
		orderStatus,
	} = order;

	const {
		loading: updateLoading,
		error,
		isUpdated,
	} = useSelector((state) => state.order);

	const shippingDetails =
		shippingInfo &&
		`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

	const isPaid =
		paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

	const orderId = match.params.id;

	useEffect(() => {
		dispatch(getOrderDetails(orderId));

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success('Order updated successfully');
			dispatch({
				type: UPDATE_ORDER_RESET,
			});
		}
	}, [dispatch, alert, error, isUpdated, orderId]);

	const updateOrderHandler = (id) => {
		const formData = new FormData();

		formData.append('status', status);

		dispatch(updateOrder(id, formData));
	};

	return (
		<Fragment>
			<MetaData title={`Update Orders # ${order._id}`} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'orders'} />
				</div>
				<div className="update-order-container col-12 col-md-9 col-lg-9 col-xl-10 pe-5">
					<h2 className="my-4">Update Order</h2>
					{loading ? (
						<Loader />
					) : (
						<div className="row d-flex shadow-lg ms-1 mb-5 py-3 px-4">
							<h6 className="mt-4">
								<span
									className="px-3 py-2"
									style={{
										backgroundColor: '#204060',
										color: 'white',
									}}
								>
									<i
										className="fas fa-clipboard-list"
										style={{ fontSize: '1.2rem' }}
									></i>
									&nbsp; Order #
								</span>
								<span
									className="px-3 py-2"
									style={{
										backgroundColor: '#ffcc66',
										color: 'black',
									}}
								>
									<strong>{order._id}</strong>
								</span>
							</h6>
							<div
								className="col-12 col-xl-8 py-4 px-4"
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
									{shippingInfo && shippingInfo.phoneNo}
								</p>
								<p>
									<b>Address : </b>
									{shippingDetails}
								</p>
								<p>
									<b>Amount : </b>${totalPrice}
								</p>
								<hr />
								<h5 className="my-4">
									<i
										className="fab fa-cc-visa"
										style={{ color: '#204060' }}
									></i>
									&nbsp; Payment :
									<span
										className={
											isPaid ? 'text-success ms-3' : 'text-danger ms-3'
										}
										style={{ fontSize: '1rem' }}
									>
										<b>{isPaid ? 'PAID' : 'NOT PAID'}</b>
									</span>
								</h5>
								<h5 className="my-4">
									<i
										className="fas fa-clipboard-list"
										style={{ color: '#204060' }}
									></i>
									&nbsp; Order Status :{' '}
									<span
										className={
											orderStatus && String(orderStatus).includes('Delivered')
												? 'text-success ms-3'
												: orderStatus &&
												  String(orderStatus).includes('Processing')
												? 'text-danger ms-3'
												: 'text-warning ms-3'
										}
										style={{ fontSize: '1rem', textTransform: 'uppercase' }}
									>
										<b>{orderStatus}</b>
									</span>{' '}
								</h5>
								<h6 className="mt-5 mb-4">
									<span
										className="px-3 py-2"
										style={{
											backgroundColor: '#204060',
											color: 'white',
										}}
									>
										<i
											className="fas fa-list-alt"
											style={{ fontSize: '1.2rem' }}
										></i>
										&nbsp; Order Items
									</span>
									<span
										className="px-3 py-2"
										style={{
											backgroundColor: '#ffcc66',
											color: 'black',
										}}
									>
										<strong>{orderItems && orderItems.length} Item(s)</strong>
									</span>
								</h6>
								{orderItems &&
									orderItems.map((item) => (
										<Fragment>
											<hr />
											<div className="cart-item my-1" key={item.product}>
												<div className="row">
													<div className="col-2 col-md-2 col-lg-2">
														<img
															src={item.image}
															alt="item.name"
															width="65"
															height="55"
														/>
													</div>
													<div className="col-5 col-md-6 col-lg-6 d-flex justify-content-center  align-items-center">
														<Link to={`/product/${item.product}`}>
															{item.name}
														</Link>
													</div>
													<div className="col-5 col-md-4 col-lg-4 mt-4 mt-lg-4">
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
							<div className="col-7 col-md-7 col-lg-6 col-xl-4 pe-4 justify-content-center">
								<div
									className="form-group mt-2 shadow-lg px-4 py-4 mb-4"
									style={{ borderRadius: '0.3rem' }}
								>
									<h4>Status</h4>
									<select
										className="form-select mt-2"
										name="status"
										onChange={(e) => setStatus(e.target.value)}
									>
										<option
											value="Processing"
											selected={
												order.orderStatus === 'Processing' ? 'selected' : ''
											}
										>
											Processing
										</option>
										<option
											value="Shipped"
											selected={
												order.orderStatus === 'Shipped' ? 'selected' : ''
											}
										>
											Shipped
										</option>
										<option
											value="Delivered"
											selected={
												order.orderStatus === 'Delivered' ? 'selected' : ''
											}
										>
											Delivered
										</option>
									</select>
									<button
										className="btn btn-yellow w-100 mt-3"
										onClick={() => updateOrderHandler(order._id)}
									>
										Update Status
									</button>
								</div>
							</div>
							{updateLoading && <ProcessLoader />}
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default ProcessOrder;
