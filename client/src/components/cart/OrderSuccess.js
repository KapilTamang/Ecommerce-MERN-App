import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';

const OrderSuccess = () => {
	return (
		<Fragment>
			<MetaData title={'Order Success'} />
			<div className="row justify-content-center ">
				<div
					className="col-6 text-center mt-5"
					style={{ width: '100%', height: '58vh' }}
				>
					<img
						src="/images/order_success.svg"
						alt=""
						className="mt-4 mb-2 img-fluid d-block mx-auto"
						width="300"
					/>
					<h4>Your Order has been placed successfully.</h4>
					<Link to="/orders/me" className="btn btn-yellow mt-3 mb-5">
						Go to Orders
					</Link>
				</div>
			</div>
		</Fragment>
	);
};

export default OrderSuccess;
