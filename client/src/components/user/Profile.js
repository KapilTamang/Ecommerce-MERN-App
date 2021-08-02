import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';

const Profile = () => {
	const { user, loading } = useSelector((state) => state.auth);

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title="My Profile" />
					<h2 className="mt-5 ms-5">My Profile</h2>
					<div
						className="ms-5"
						style={{
							width: '7rem',
							height: '0.3rem',
							backgroundColor: '#ffcc66',
						}}
					></div>
					<div className="row justify-content-around mt-4 user-info">
						<div className="col-10 col-md-5 col-lg-4 shadow-lg px-4 pb-5 pt-3 user-avatar">
							<figure className="avatar-profile">
								<img
									src={user.avatar.url}
									alt={user.name}
									className="rounded-circle img-fluid"
								/>
							</figure>
							<Link
								to="/me/update"
								id="editProfile_btn"
								className="btn btn-yellow w-100 "
							>
								Eidt Profile
							</Link>
						</div>
						<div className="col-10 col-md-6 col-lg-6 px-5 py-4 shadow-lg">
							<h4>Full Name</h4>
							<p>{user.name}</p>
							<h4>Email Address</h4>
							<p>{user.email}</p>
							<h4>Joined On</h4>
							<p>{String(user.createdAt).substring(0, 10)}</p>
							{user.role !== 'admin' && (
								<Link
									to="/orders/me"
									id="myOrders_btn"
									className="btn btn-yellow w-100 mt-5"
								>
									My Orders
								</Link>
							)}
							<Link
								to="/password/update"
								id="changePassword_btn"
								className="btn btn-blue w-100 mt-3 mb-2 text-white"
							>
								Change Password
							</Link>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Profile;
