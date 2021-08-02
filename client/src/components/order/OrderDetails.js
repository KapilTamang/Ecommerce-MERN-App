import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, clearErrors } from '../../actions/orderAction';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';

const OrderDetails = ({ match }) => {
	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, error, order } = useSelector((state) => state.orderDetails);
	const {
		_id,
		shippingInfo,
		orderItems,
		paymentInfo,
		user,
		totalPrice,
		orderStatus,
	} = { ...order };

	useEffect(() => {
		dispatch(getOrderDetails(match.params.id));

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
	}, [dispatch, alert, error, match.params.id]);

	const isPaid =
		paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

	const shippingDetails =
		shippingInfo &&
		`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

	return (
		<Fragment>
			<MetaData title={'Order Details'} />
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<h6 className="mt-5">
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
							<strong>{_id}</strong>
						</span>
					</h6>
					<div className="container container-fluid">
						<div className="row d-flex justify-content-between">
							<div
								className="col-12 col-lg-8 mt-3 order-details px-4 py-4 shadow-lg"
								style={{ borderRadius: '1rem' }}
							>
								<h4 className="mb-4">
									<i
										className="fas fa-shipping-fast"
										style={{ color: '#204060' }}
									></i>
									&nbsp; Shipping Info
								</h4>
								<p>
									<b>Name : </b>
									{user && user.name}
								</p>
								<p>
									<b>Phone No. : </b>
									{shippingInfo && shippingInfo.phoneNo}
								</p>
								<p className="mb-4">
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

								<h5 className="my-4">
									<i
										className="fas fa-list-alt"
										style={{ color: '#204060' }}
									></i>
									&nbsp; Order Items
								</h5>
								<hr />
								<div className="cart-item my-1">
									{orderItems &&
										orderItems.map((item) => (
											<Fragment>
												<div className="row my-4" key={item.product}>
													<div className="col col-lg-2">
														<img
															src={item.image}
															alt={item.name}
															width="70"
															height="55"
														/>
													</div>
													<div className="col-5 col-lg-5">
														<Link to={`/product/${item.product}`}>
															{item.name}
														</Link>
													</div>
													<div className="col-4 col-lg-2 mt-4 mt-lg-0">
														${item.price}
													</div>
													<div className="col-4 col-lg-3 mt-4 mt-lg-0">
														${item.quantity} Unit(s)
													</div>
												</div>
												<hr />
											</Fragment>
										))}
								</div>
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

export default OrderDetails;
