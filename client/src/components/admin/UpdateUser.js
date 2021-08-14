import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import Loader from '../layouts/Loader';
import ProcessLoader from '../layouts/ProcessLoader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateUser,
	getUserDetails,
	clearErrors,
} from '../../actions/userAction';
import { UPDATE_USER_RESET } from '../../constants/userConstants';

const UpdateUser = ({ match, history }) => {
	const [name, setName] = useState('');

	const [email, setEmail] = useState('');

	const [role, setRole] = useState('');

	const [avatar, setAvatar] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, error, isUpdated } = useSelector((state) => state.user);

	const { loading: userDetailsLoading, user } = useSelector(
		(state) => state.userDetails
	);

	const userId = match.params.id;

	useEffect(() => {
		if (user && user._id !== userId) {
			dispatch(getUserDetails(userId));
		} else {
			setName(user.name);
			setEmail(user.email);
			setRole(user.role);
			setAvatar(user.avatar.url);
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success('User Updated Successfully');
			dispatch({
				type: UPDATE_USER_RESET,
			});

			history.push('/admin/users');
		}
	}, [dispatch, alert, error, user, userId, isUpdated, history]);

	const updateUserHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append('name', name);
		formData.append('email', email);
		formData.append('role', role);

		dispatch(updateUser(user._id, formData));
	};

	return (
		<Fragment>
			<MetaData title={'Update User'} />
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar activeMenu={'users'} />
				</div>
				<div className="col-12 col-md-10 pe-5 pt-4">
					{userDetailsLoading ? (
						<Loader />
					) : (
						<form
							className="dashboard-form shadow-lg pt-3 pb-5 px-5 my-5"
							onSubmit={updateUserHandler}
						>
							<h2 className="text-center mt-3 mb-5">Update User</h2>
							<div className="row">
								<div className="col-12 col-md-4 d-flex justify-content-center py-5 ps-0">
									<img
										src={avatar}
										alt="avatar"
										width="90%"
										className="img-fluid"
										style={{ border: '3px solid rgba(197, 199, 201, 0.5)' }}
									/>
								</div>
								<div className="col-12 col-md-8">
									<div className="form-group mb-3">
										<label htmlFor="name_field" className="form-label">
											Name
										</label>
										<input
											type="text"
											className="form-control"
											id="name_field"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="form-group mb-3">
										<label htmlFor="email_field" className="form-label">
											Email
										</label>
										<input
											type="email"
											className="form-control"
											id="email_field"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="form-group mb-3">
										<label htmlFor="role_field" className="form-label">
											Role
										</label>
										<select
											name="role"
											className="form-select"
											id="role_field"
											onChange={(e) => setRole(e.target.value)}
										>
											<option
												className="admin"
												value="admin"
												selected={role === 'admin' ? 'selected' : ''}
											>
												Admin
											</option>
											<option
												className="user"
												value="user"
												selected={role === 'user' ? 'selected' : ''}
											>
												User
											</option>
										</select>
									</div>
									<button
										type="submit"
										className="btn-yellow w-100 py-3 mt-3"
										disabled={loading ? true : false}
									>
										UPDATE
									</button>
								</div>
							</div>
						</form>
					)}
				</div>
			</div>
			{loading && <ProcessLoader />}
		</Fragment>
	);
};

export default UpdateUser;
