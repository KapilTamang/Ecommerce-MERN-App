import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from '../../actions/productAction';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';

const Dashboard = () => {
	const dispatch = useDispatch();

	const { loading, products, productsCount } = useSelector(
		(state) => state.products
	);

	const { totalAmount, ordersCount } = useSelector((state) => state.allOrders);

	const { users } = useSelector((state) => state.allUsers);

	let outOfStock = 0;

	if (products) {
		products.forEach((product) => {
			if (product.stock === 0) {
				outOfStock += 1;
			}
		});
	}

	useEffect(() => {
		dispatch(getAdminProducts());
		dispatch(getAllOrders());
		dispatch(getAllUsers());
	}, [dispatch]);

	return (
		<Fragment>
			<MetaData title={'Dashboard'} />
			<div className="row ">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'dashboard'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10">
					<h2 className="dashboard-title my-4">Dashboard</h2>
					{loading ? (
						<Loader />
					) : (
						<Fragment>
							<div className="row d-flex justify-content-center pe-4">
								<div className="col-10 col-sm-10 col-md-12 col-lg-12 col-xl-12  mb-4">
									<div
										className="card text-white bg-gradient o-hidden h-100 shadow-lg"
										style={{ backgroundColor: '#204060' }}
									>
										<div className="card-body">
											<div className="text-center card-font-size">
												Total Amount <br />
												<b style={{ color: '#ffcc66' }}>
													${totalAmount && totalAmount.toFixed(2)}
												</b>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row d-flex justify-content-center pe-4">
								<div className="col-10 col-sm-5 col-md-6 col-lg-6 col-xl-3 mb-4">
									<div
										className="card bg-gradient o-hidden h-100 shadow-lg"
										style={{ backgroundColor: '#204060', color: '#ffcc66' }}
									>
										<div className="card-body">
											<div className="text-center card-font-size">
												<i
													className="fab fa-product-hunt mb-2"
													style={{ fontSize: '2.5rem' }}
												></i>{' '}
												<br />
												<span className="text-white">Products </span>
												<br />
												<b>{productsCount}</b>
											</div>
										</div>
										<Link
											to="/admin/products"
											className="card-footer dashboard-link clearfix small z-1 text-white"
										>
											<span className="float-start">View Details</span>
											<span className="float-end">
												<i className="fas fa-angle-right"></i>
											</span>
										</Link>
									</div>
								</div>
								<div className="col-10 col-sm-5 col-md-6 col-lg-6 col-xl-3 mb-4">
									<div
										className="card bg-gradient o-hidden h-100 shadow-lg"
										style={{ backgroundColor: '#204060', color: '#ffcc66' }}
									>
										<div className="card-body">
											<div className="text-center card-font-size">
												<i
													className="fas fa-shopping-basket mb-2"
													style={{ fontSize: '2.5rem' }}
												></i>
												<br />
												<span className="text-white">Orders </span> <br />
												<b>{ordersCount && ordersCount}</b>
											</div>
										</div>
										<Link
											to="/admin/orders"
											className="card-footer dashboard-link text-white clearfix small z-1"
										>
											<span className="float-start">View Details</span>
											<span className="float-end">
												<i className="fas fa-angle-right"></i>
											</span>
										</Link>
									</div>
								</div>
								<div className="col-10 col-sm-5 col-md-6 col-lg-6 col-xl-3 mb-4">
									<div
										className="card bg-gradient o-hidden h-100 shadow-lg"
										style={{ backgroundColor: '#204060', color: '#ffcc66' }}
									>
										<div className="card-body">
											<div className="text-center card-font-size">
												<i
													className="fas fa-users mb-2"
													style={{ fontSize: '2.5rem' }}
												></i>{' '}
												<br />
												<span className="text-white">Users</span> <br />
												<b style={{ color: '#ffcc66' }}>
													{users && users.length}
												</b>
											</div>
										</div>
										<Link
											to="/admin/users"
											className="card-footer dashboard-link text-white clearfix small z-1"
										>
											<span className="float-start">View Details</span>
											<span className="float-end">
												<i className="fas fa-angle-right"></i>
											</span>
										</Link>
									</div>
								</div>
								<div className="col-10 col-sm-5 col-md-6 col-lg-6 col-xl-3 mb-4">
									<div
										className="card bg-gradient o-hidden h-100 shadow-lg"
										style={{ backgroundColor: '#204060', color: '#ffcc66' }}
									>
										<div className="card-body">
											<div className="text-center card-font-size">
												<i
													class="fas fa-store-alt-slash mb-2"
													style={{ fontSize: '2.5rem' }}
												></i>{' '}
												<br />
												<span className="text-white">Out of Stock </span> <br />
												<b style={{ color: '#ffcc66' }}>{outOfStock}</b>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Fragment>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default Dashboard;
