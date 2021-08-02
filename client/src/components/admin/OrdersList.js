import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MetaData from '../layouts/MetaData';
import NotFound from '../layouts/NotFound';
import Loader from '../layouts/Loader';
import Pagination from 'react-js-pagination';
import ProcessLoader from '../layouts/ProcessLoader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAllOrders,
	deleteOrder,
	clearErrors,
} from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import ConfirmModal from '../layouts/ConfirmModal';

const OrdersList = () => {
	const [perPage, setPerPage] = useState(8);

	const [currentPage, setCurrentPage] = useState(1);

	const [searchText, setSearchText] = useState('');

	const [keyword, setKeyword] = useState('');

	const [id, setId] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const {
		loading,
		error,
		orders,
		resPerPage,
		ordersCount,
		filteredOrdersCount,
	} = useSelector((state) => state.allOrders);

	const {
		loading: deleteLoading,
		error: deleteError,
		isDeleted,
	} = useSelector((state) => state.order);

	useEffect(() => {
		dispatch(getAllOrders(keyword, currentPage, perPage));

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
			setKeyword('');
		}

		if (deleteError) {
			alert.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			alert.success('Order deleted successfully');
			dispatch({
				type: DELETE_ORDER_RESET,
			});
		}
	}, [
		dispatch,
		error,
		alert,
		deleteError,
		isDeleted,
		keyword,
		currentPage,
		perPage,
	]);

	const searchHandler = (e) => {
		e.preventDefault();
		setKeyword(searchText);
	};

	const resetSearchHandler = (e) => {
		e.preventDefault();

		setKeyword('');
		setSearchText('');
	};

	let count;

	if (keyword) {
		count = filteredOrdersCount;
	} else {
		count = ordersCount;
	}

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}

	const deleteOrderHandler = (id) => {
		const confirmationDialog = document.querySelector('.confirmation-dialog');

		confirmationDialog.classList.add('visually-hide-dialog');

		confirmationDialog.addEventListener(
			'transitionend',
			function (e) {
				confirmationDialog.classList.add('hide-dialog');
			},
			{
				capture: false,
				once: true,
				passive: false,
			}
		);

		dispatch(deleteOrder(id));
	};

	const showDialog = (id) => {
		setId(id);

		const confirmationDialog = document.querySelector('.confirmation-dialog');

		confirmationDialog.classList.remove('hide-dialog');

		setTimeout(function () {
			confirmationDialog.classList.remove('visually-hide-dialog');
		}, 20);
	};

	return (
		<Fragment>
			<MetaData title={'All Orders'} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'orders'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10 pe-5">
					<h2 className="my-4 title-dashboard">All Orders</h2>
					<div className=" row d-flex">
						<div className="col-9 col-md-5 col-lg-4 col-xl-3 d-flex">
							<input
								className="form-control search-dashboard me-2"
								type="search"
								value={searchText}
								placeholder="Enter Order ID"
								onChange={(e) => setSearchText(e.target.value)}
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
						<div className="col-6 col-md-2 col-lg-4 col-xl-6"></div>
						<div className="col-6 col-md-5 col-lg-4 col-xl-3 entries-dashboard d-flex justify-content-center align-items-center">
							Show
							<select
								name="perPage"
								id="perpage_field"
								className="form-select mx-2"
								value={perPage}
								onChange={(e) => setPerPage(e.target.value)}
								disabled={
									!loading && orders && orders.length === 0 ? true : false
								}
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
							<NotFound image={'empty_order'} msg={'Order Not Found'} />
						</Fragment>
					) : (
						<Fragment>
							<div className="table-responsive table-dashboard mb-5">
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
													<td
														className={
															order.orderStatus &&
															String(order.orderStatus).includes('Processing')
																? 'text-danger'
																: order.orderStatus &&
																  String(order.orderStatus).includes(
																		'Delivered'
																  )
																? 'text-success'
																: 'text-warning'
														}
														style={{ padding: '0.6rem 2rem' }}
													>
														{order.orderStatus}
													</td>
													<td>
														<Link
															to={`/admin/order/${order._id}`}
															className="btn btn-view py-1 px-1 ms-4"
														>
															<i className="fas fa-eye"></i>
														</Link>
														<Link
															className="btn btn-delete py-1 px-1 ms-1"
															onClick={() => showDialog(order._id)}
														>
															<i className="fas fa-trash" />
														</Link>
													</td>
												</tr>
											))}
									</tbody>
								</table>
								{resPerPage < count && (
									<div className="d-flex justify-content-end mt-4">
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
							{deleteLoading && <ProcessLoader />}
						</Fragment>
					)}
					<ConfirmModal
						msg={'Are you sure to delete ?'}
						confirmHandler={deleteOrderHandler}
						id={id}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default OrdersList;
