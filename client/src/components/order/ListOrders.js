import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import NotFound from '../layouts/NotFound';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders, clearErrors } from '../../actions/orderAction';
import { useAlert } from 'react-alert';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';

const ListOrders = () => {
	const [keyword, setKeyword] = useState('');

	const [searchText, setSearchText] = useState('');

	const [currentPage, setCurrentPage] = useState(1);

	const [perPage, setPerPage] = useState(8);

	const alert = useAlert();

	const dispatch = useDispatch();

	const {
		loading,
		error,
		orders,
		ordersCount,
		filteredOrdersCount,
		resPerPage,
	} = useSelector((state) => state.myOrders);

	useEffect(() => {
		dispatch(getMyOrders(keyword, currentPage, perPage));

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
			setKeyword('');
		}
	}, [dispatch, alert, error, keyword, currentPage, perPage]);

	let count;

	if (keyword) {
		count = filteredOrdersCount;
	} else {
		count = ordersCount;
	}

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}

	const searchHandler = (e) => {
		e.preventDefault();
		setKeyword(searchText);
	};

	const resetSearchHandler = (e) => {
		e.preventDefault();

		setKeyword('');
		setSearchText('');
	};

	return (
		<Fragment>
			<MetaData title={'My Orders'} />
			<h3 className="mt-4 ">My Orders</h3>
			<div
				style={{
					width: '7rem',
					height: '0.3rem',
					backgroundColor: '#ffcc66',
				}}
			></div>
			<div className=" row d-flex justify-content-center mt-4">
				<div className="order-search col-11 col-md-5 col-lg-4 d-flex">
					<input
						className="form-control me-2"
						type="search"
						value={searchText}
						placeholder="Enter Order ID"
						onChange={(e) => setSearchText(e.target.value)}
						disabled={!loading && orders && orders.length === 0}
					/>
					<button
						class="btn btn-blue btn-sm me-2 shadow"
						onClick={searchHandler}
					>
						<i class="fas fa-search"></i>
					</button>
					<button
						class="btn btn-yellow btn-sm shadow"
						onClick={resetSearchHandler}
					>
						<i class="fas fa-undo-alt"></i>
					</button>
				</div>
				<div className="col-12 col-md-3 col-lg-5"></div>
				<div className="col-11 col-md-4 col-lg-3 d-flex justify-content-center align-items-center">
					Show
					<select
						name="perPage"
						id="perpage_field"
						className="form-select mx-2"
						value={perPage}
						onChange={(e) => setPerPage(e.target.value)}
						disabled={!loading && orders && orders.length === 0 ? true : false}
					>
						<option value="6">6</option>
						<option value="8">8</option>
						<option value="10">10</option>
						<option value="12">12</option>
						<option value="14">14</option>
					</select>{' '}
					Records
				</div>
			</div>
			{loading ? (
				<Loader />
			) : !loading && orders && orders.length === 0 ? (
				<Fragment>
					<NotFound image={'empty_cart'} msg={'No Orders Yet'} />
					<div className="d-flex justify-content-center">
						<Link to="/" className="text-center btn btn-yellow">
							Shop Now
						</Link>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<div className="row">
						<div className="col-12">
							<div className="table-responsive">
								<table class="table table-striped table-bordered table-hover shadow mt-3">
									<thead>
										<tr>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Order ID
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												No of Items
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Amount
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Status
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{orders &&
											orders.map((order) => (
												<tr key={order._id}>
													<th scope="row" style={{ padding: '0.6rem 2rem' }}>
														{order._id}
													</th>
													<td style={{ padding: '0.6rem 2rem' }}>
														{order.orderItems.length}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														${order.totalPrice}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														{order.orderStatus && (
															<p
																className={String(
																	order.orderStatus === 'Delivered'
																		? 'text-success'
																		: order.orderStatus === 'Processing'
																		? 'text-danger'
																		: 'text-warning'
																)}
															>
																{order.orderStatus}
															</p>
														)}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														<Link
															to={`/order/${order._id}`}
															className="btn btn-blue btn-sm"
														>
															View Order
														</Link>
													</td>
												</tr>
											))}
									</tbody>
								</table>
								{resPerPage < count && (
									<div className="d-flex justify-content-end my-4">
										<Pagination
											activePage={currentPage}
											itemsCountPerPage={resPerPage}
											totalItemsCount={ordersCount}
											onChange={setCurrentPageNo}
											nextPageText={'Next'}
											prevPageText={'Prev'}
											firstPageText={'First'}
											lastPageText={'Last'}
											itemClass="page-item"
											linkClass="page-link"
										></Pagination>
									</div>
								)}
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

export default ListOrders;
