import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import FormLoader from '../layouts/FormLoader';
import MetaData from '../layouts/MetaData';

import { login, clearErrors } from '../../actions/userAction';

const Login = ({ history, location }) => {
	const dispatch = useDispatch();

	const alert = useAlert();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { isAuthenticated, error, loading } = useSelector(
		(state) => state.auth
	);

	const redirect = location.search ? location.search.split('=')[1] : '/';

	useEffect(() => {
		if (isAuthenticated) {
			history.push(redirect);
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
	}, [dispatch, alert, isAuthenticated, error, redirect, history]);

	const loginHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	return (
		<Fragment>
			<MetaData title="Login" />
			<div className="container container-fluid">
				<div className="row wrapper">
					<div className="col-10 col-lg-5">
						<form onSubmit={loginHandler} className="shadow-lg">
							{loading && <FormLoader />}
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Login
							</p>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									type="email"
									id="email_field"
									className="form-control"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<Link to="/password/forgot" className="float-end">
								Forgot Password?
							</Link>
							<button
								type="submit"
								className="w-100 btn btn-yellow btn-lg py-2"
							>
								Login
							</button>
							<Link to="/register" className="float-end mt-3 ">
								New User?
							</Link>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Login;
