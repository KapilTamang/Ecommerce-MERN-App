import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import FormLoader from '../layouts/FormLoader';
import MetaData from '../layouts/MetaData';

import {
	register,
	clearErrors,
	clearSuccessMessage,
} from '../../actions/userAction';

const Register = ({ history }) => {
	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
	});

	const [avatar, setAvatar] = useState('');

	const [avatarPreview, setAvatarPreview] = useState('');

	const dispatch = useDispatch();

	const alert = useAlert();

	const { isAuthenticated, loading, error, message } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (isAuthenticated) {
			if (message) {
				alert.success(message);
				dispatch(clearSuccessMessage());
			}
			history.push('/');
		}
		if (error) {
			if (user.name !== '') {
				alert.error(error);
				dispatch(clearErrors());
			}
		}
	}, [dispatch, isAuthenticated, error, alert, history, message]);

	console.log(avatarPreview);

	const registerHandler = (e) => {
		e.preventDefault();

		dispatch(register(user, avatar));
	};

	const onChange = (e) => {
		if (e.target.name === 'avatar') {
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.readyState === 2) {
					setAvatarPreview(reader.result);
					setAvatar(reader.result);
				}
			};

			reader.readAsDataURL(e.target.files[0]);
		} else {
			setUser({ ...user, [e.target.name]: e.target.value });
		}
	};

	return (
		<Fragment>
			<MetaData title={'Register'} />
			<div className="container container-fluid">
				<div className="row wrapper">
					<div className="col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5">
						<form onSubmit={registerHandler} className="shadow-lg">
							{loading && <FormLoader />}
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Registration
							</p>
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									type="text"
									id="name_field"
									className="form-control"
									name="name"
									value={user.name}
									onChange={onChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									type="email"
									id="email_field"
									className="form-control"
									name="email"
									value={user.email}
									onChange={onChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<input
									type="password"
									id="password_field"
									className="form-control"
									name="password"
									value={user.password}
									onChange={onChange}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="avatar_upload" className="mb-2">
									Avatar
								</label>
								<div className="d-flex align-items-center">
									<div>
										<figure className="avatar">
											{avatarPreview ? (
												<img
													src={avatarPreview}
													alt="avatar_preview"
													width="10px"
													className="rounded-circle"
												/>
											) : (
												<i
													class="fas fa-user-circle"
													style={{ fontSize: '3rem', color: '#204060' }}
												></i>
											)}
										</figure>
									</div>
									<div style={{ width: '15px' }}></div>
									<div>
										<input
											type="file"
											className="form-control"
											name="avatar"
											id="customFile"
											accept="images/*"
											onChange={onChange}
										/>
									</div>
								</div>
							</div>
							<button
								type="submit"
								className="w-100 btn btn-yellow btn-lg py-2 mt-4"
								disabled={loading ? true : false}
							>
								Register
							</button>
							<Link to="/login" className="float-end mt-3 ">
								Back to Login?
							</Link>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Register;
