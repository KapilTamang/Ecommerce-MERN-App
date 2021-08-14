import React, { Fragment, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import FormLoader from '../layouts/FormLoader';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import {
	emailVerification,
	clearSuccessMessage,
	clearErrors,
} from '../../actions/userAction';

const VerifyEmailRequest = () => {
	const alert = useAlert();

	const dispatch = useDispatch();

	const { isAuthenticated, user } = useSelector((state) => state.auth);

	const { loading, error, message } = useSelector(
		(state) => state.emailVerification
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

	const verifyEmailRequestHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append('email', user.email);

		dispatch(emailVerification(formData));
	};

	return (
		<Fragment>
			<MetaData title="Email Verification" />
			<div className="container container-fluid">
				<div className="row wrapper">
					{!isAuthenticated ? (
						<Redirect to="/" />
					) : (
						user && (
							<Fragment>
								<h5 className="text-muted text-center mb-4">
									Hello! <strong>{user && user.name}</strong> , Your email has
									not been verified. Please verify.
								</h5>
								<div className="col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5">
									<form
										onSubmit={verifyEmailRequestHandler}
										className="shadow-lg"
									>
										{loading && <FormLoader />}
										<p
											className="mb-3 text-center"
											style={{ color: '#204060', fontSize: '1.5rem' }}
										>
											Email Verification
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
												value={user && user.email}
												required
											/>
										</div>
										<button
											type="submit"
											className="w-100 btn btn-yellow btn-lg py-2 mt-4"
											disabled={loading ? true : false}
										>
											Verify
										</button>
									</form>
								</div>
							</Fragment>
						)
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default VerifyEmailRequest;
