import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import FormLoader from '../layouts/FormLoader';
import MetaData from '../layouts/MetaData';

import { register, clearErrors } from '../../actions/userAction';

const Register = ({ history }) => {
	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
	});

	const { name, email, password } = user;

	const [avatar, setAvatar] = useState('');

	const [avatarPreview, setAvatarPreview] = useState('');

	const dispatch = useDispatch();

	const alert = useAlert();

	const { isAuthenticated, loading, error } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (isAuthenticated) {
			history.push('/');
		}
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
	}, [dispatch, isAuthenticated, error, alert, history]);

	const registerHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append('name', name);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('avatar', avatar);

		dispatch(register(formData));
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
					<div className="col-10 col-lg-5">
						<form
							onSubmit={registerHandler}
							className="shadow-lg"
							encType="multipart/form-data"
						>
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
									value={name}
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
									value={email}
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
									value={password}
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
