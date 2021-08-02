import React, { Fragment, useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearErrors } from '../../actions/userAction';
import FormLoader from '../layouts/FormLoader';
import MetaData from '../layouts/MetaData';

const ResetPassword = ({ history, match }) => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const alert = useAlert();
	const dispatch = useDispatch();

	const { loading, error, success } = useSelector(
		(state) => state.forgotPassword
	);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (success) {
			alert.success('Password Reset Successful');
			history.push('/login');
		}
	}, [dispatch, error, alert, success, history]);

	const resetPasswordHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append('password', password);
		formData.append('confirmPassword', confirmPassword);

		dispatch(resetPassword(match.params.token, formData));
	};

	return (
		<Fragment>
			<MetaData title="Reset Password" />
			<div className="container container-fluid">
				<div className="row wrapper">
					<div className="col-10 col-lg-5">
						<form onSubmit={resetPasswordHandler} className="shadow-lg">
							{loading && <FormLoader />}
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Reset Password
							</p>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">
									New Password
								</label>
								<input
									type="password"
									id="password_field"
									className="form-control"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="confirmPassword" className="form-label">
									Confirm New Password
								</label>
								<input
									type="password"
									id="confirm_password_field"
									className="form-control"
									name="confirmPassword"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>
							<button
								type="submit"
								className="w-100 btn btn-yellow btn-lg py-2 mt-4"
								disabled={loading ? true : false}
							>
								Reset Password
							</button>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ResetPassword;
