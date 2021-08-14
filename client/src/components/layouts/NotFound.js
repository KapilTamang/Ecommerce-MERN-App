import React, { Fragment } from 'react';
import MetaData from '../layouts/MetaData';

const NotFound = ({ image, msg }) => {
	return (
		<Fragment>
			<MetaData title={'Not Found'} />
			<div className="row justify-content-center mb-4">
				<div className="col-6 mt-5 text-center not-found-image">
					<img
						src={`/images/${image}.svg`}
						alt=""
						className="mt-4  img-fluid d-block mx-auto "
					/>
					<h3>{msg}</h3>
				</div>
			</div>
		</Fragment>
	);
};

export default NotFound;
