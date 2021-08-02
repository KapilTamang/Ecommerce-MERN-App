import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';

const OrderSuccess = () => {
	return (
		<Fragment>
			<MetaData title={'Order Success'} />
			<div className="row justify-content-center">
				<div className="col-6 mt-5 text-center">
					<img
						src="/images/order_success.svg"
						alt=""
						className="mt-4 mb-1 img-fluid d-block mx-auto"
						width="300"
					/>
					<h3>Your Order has been placed successfully.</h3>
					<Link to="/orders/me" className="btn btn-yellow mt-3">
						Go to Orders
					</Link>
				</div>
			</div>
		</Fragment>
	);
};

export default OrderSuccess;
