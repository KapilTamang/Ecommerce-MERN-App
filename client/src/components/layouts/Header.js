import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../actions/userAction';

const Header = () => {
	const alert = useAlert();
	const dispatch = useDispatch();

	const { user, loading } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.cart);

	const logoutHandler = () => {
		dispatch(logout());
		alert.success('Logout Successful');
	};

	return (
		<Fragment>
			<nav className="navbar row">
				<div className="col-2 col-sm-2 col-md-2 col-lg-3 my-2">
					<div className="navbar-brand ms-3">
						<Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
							<img src="/images/logo.svg" alt="" width="150" />
						</Link>
					</div>
				</div>
				<div className=" col-7 col-sm-5 col-md-4 col-lg-4 mt-2 mt-md-0 ">
					<Route render={({ history }) => <Search history={history} />} />
				</div>
				<div className="d-flex col-8 col-sm-7 col-md-5 col-lg-5 mt-4 mt-md-0 pe-4 text-center align-items-center justify-content-end">
					<Link to="/cart" style={{ textDecoration: 'none' }}>
						<span id="cart" className="nav-cart me-1">
							Cart
						</span>
						<span id="cart_count" className="me-4">
							{cartItems.length}
						</span>
					</Link>
					{user ? (
						<div className="dropdown ms-3">
							<Link to="#!" type="button" className="dropdown-btn text-white">
								<figure className="avatar avatar-nav">
									<img
										src={user.avatar && user.avatar.url}
										alt={user && user.name}
										className="rounded-circle"
									/>
								</figure>
								<span>
									{user && user.name}&nbsp;{' '}
									<i className="fas fa-caret-down"></i>
								</span>
							</Link>
							<div className="dropdown-content shadow text-start">
								{user && user.role === 'admin' && (
									<Link to="/dashboard" className="dropdown-item">
										<i class="fas fa-tachometer-alt"></i>&nbsp; Dashboard
									</Link>
								)}
								<Link to="/orders/me" className="dropdown-item">
									<i class="fas fa-clipboard-list"></i>&nbsp; Orders
								</Link>
								<Link to="/me" className="dropdown-item">
									<i class="fas fa-user-circle"></i>&nbsp; Profile
								</Link>
								<Link
									to="#!"
									className="dropdown-item text-danger"
									onClick={logoutHandler}
								>
									<i class="fas fa-sign-out-alt"></i>&nbsp; Logout
								</Link>
							</div>
						</div>
					) : (
						!loading && (
							<Link to="/login" className="btn btn-sm btn-yellow">
								Login
							</Link>
						)
					)}
				</div>
			</nav>
		</Fragment>
	);
};

export default Header;
