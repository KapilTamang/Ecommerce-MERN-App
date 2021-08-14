import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	forgotPassword,
	clearSuccessMessage,
	clearErrors,
} from '../../actions/userAction';
import MetaData from '../layouts/MetaData';
import FormLoader from '../layouts/FormLoader';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, message, error } = useSelector(
		(state) => state.forgotPassword
	);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (message) {
			alert.success(message);
			dispatch(clearSuccessMessage());
		}
	}, [dispatch, alert, error, message]);

	const forgotPasswordHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append('email', email);

		dispatch(forgotPassword(formData));
	};

	return (
		<Fragment>
			<MetaData title="Forgot Password" />
			<div className="container container-fluid">
				<div className="row wrapper">
					<div className="col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5">
						<form onSubmit={forgotPasswordHandler} className="shadow-lg">
							{loading && <FormLoader />}
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Forgot Password
							</p>
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
							<button
								type="submit"
								className="w-100 btn btn-yellow btn-lg py-2 mt-4"
								disabled={loading ? true : false}
							>
								Send Email
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

export default ForgotPassword;
