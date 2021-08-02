import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layouts/MetaData';
import { updateProfile, loadUser, clearErrors } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import FormLoader from '../layouts/FormLoader';

const UpdateProfile = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { error, isUpdated, loading } = useSelector((state) => state.user);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setAvatarPreview(user.avatar.url);
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success('Profile Update Successful.');
			dispatch(loadUser());

			history.push('/me');

			dispatch({
				type: UPDATE_PROFILE_RESET,
			});
		}
	}, [dispatch, alert, isUpdated, error, user, history]);

	const onChange = (e) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (reader.readyState === 2) {
				setAvatarPreview(reader.result);
				setAvatar(reader.result);
			}
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	const updateProfileHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		formData.append('avatar', avatar);

		dispatch(updateProfile(formData));
	};

	return (
		<Fragment>
			<MetaData title="Update Profile" />
			<div className="container container-fluid">
				<div className="row wrapper">
					<div className="col-10 col-lg-5">
						<form
							onSubmit={updateProfileHandler}
							className="shadow-lg"
							enctype="multipart/form-data"
						>
							{loading && <FormLoader />}
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Update Profile
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
									onChange={(e) => setName(e.target.value)}
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
									onChange={(e) => setEmail(e.target.value)}
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
								Update
							</button>
							<Link to="/me" className="float-end mt-3 ">
								Back to Profile?
							</Link>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default UpdateProfile;
