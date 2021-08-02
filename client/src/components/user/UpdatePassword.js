import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, clearErrors } from '../../actions/userAction';
import MetaData from '../layouts/MetaData';
import FormLoader from '../layouts/FormLoader';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';

const UpdatePassword = ({ history }) => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const alert = useAlert();
	const dispatch = useDispatch();

	const { loading, error, isUpdated } = useSelector((state) => state.user);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success('Password Update Successful.');

			dispatch({
				type: UPDATE_PASSWORD_RESET,
			});

			history.push('/me');
		}
	}, [dispatch, error, alert, isUpdated, history]);

	const updatePasswordHandler = (e) => {
		e.preventDefault();

		if (newPassword !== confirmNewPassword) {
			alert.error('New Password Donot Match');
		} else {
			const formData = new FormData();

			formData.append('oldPassword', oldPassword);
			formData.append('newPassword', newPassword);
			formData.append('confirmNewPassword', confirmNewPassword);

			dispatch(updatePassword(formData));
		}
	};

	return (
		<Fragment>
			<MetaData title="Change Password" />
			<div className="container container-fluid">
				<div className="row wrapper">
					<div className="col-10 col-lg-5">
						<form onSubmit={updatePasswordHandler} className="shadow-lg">
							{loading && <FormLoader />}
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Update Password
							</p>
							<div className="mb-3">
								<label htmlFor="oldPassword" className="form-label">
									Old Password
								</label>
								<input
									type="password"
									id="old_password_field"
									className="form-control"
									name="oldPassword"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="newPassword" className="form-label">
									New Password
								</label>
								<input
									type="password"
									id="new_password_field"
									className="form-control"
									name="newPassword"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="confirmNewPassword" className="form-label">
									Confirm New Password
								</label>
								<input
									type="password"
									id="confrim_new_password_field"
									className="form-control"
									name="confirmNewPassword"
									value={confirmNewPassword}
									onChange={(e) => setConfirmNewPassword(e.target.value)}
									required
								/>
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

export default UpdatePassword;
