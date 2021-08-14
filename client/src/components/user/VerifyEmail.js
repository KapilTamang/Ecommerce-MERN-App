import React, { useEffect, Fragment } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layouts/MetaData';
import {
	verifyEmail,
	clearErrors,
	clearSuccessMessage,
	loadUser,
} from '../../actions/userAction';

const VerifyEmail = ({ match, history }) => {
	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, error, message } = useSelector(
		(state) => state.emailVerification
	);

	const { isAuthenticated, user } = useSelector((state) => state.auth);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (user && user.isVerified === false) {
			dispatch(verifyEmail(match.params.token));
		}

		if (message) {
			alert.success(message);
			dispatch(clearSuccessMessage());
			dispatch(loadUser());
			history.push('/');
		}
	}, [dispatch, alert, loading, error, message, history, match, user]);

	return (
		<Fragment>
			<MetaData title={'Verifying Email'} />
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{ width: '100%', height: '65vh' }}
				>
					<div className="text-center">
						<img src="/images/loader1.gif" alt="" width="80px" />
						<p className="text-muted" style={{ fontSize: '1.1rem' }}>
							Verifying Email...
						</p>
					</div>
				</div>
			) : !loading && user && user.isVerified === true ? (
				<Fragment>
					<div
						className="d-flex justify-content-center align-items-center text-center mt-5 mb-4"
						style={{ width: '100%', height: '58vh' }}
					>
						<div>
							<img
								src="/images/email_verified.svg"
								className="img-fluid mb-2"
								alt=""
								width="300"
							/>
							<h4> Email Already Verified</h4>
						</div>
					</div>
				</Fragment>
			) : (
				user &&
				isAuthenticated === false && (
					<div
						className="d-flex justify-content-center align-items-center text-center mt-5 mb-4"
						style={{ width: '100%', height: '58vh' }}
					>
						<div>
							<img
								src="/images/login_required.svg"
								className="img-fluid mb-2"
								alt=""
								width="300"
							/>
							<h4>
								<i
									className="fas fa-exclamation-circle"
									style={{ color: '#FFCC66' }}
								></i>
								&nbsp; Login Required
							</h4>
						</div>
					</div>
				)
			)}
		</Fragment>
	);
};

export default VerifyEmail;
