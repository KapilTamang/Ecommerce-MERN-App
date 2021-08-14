import React, { Fragment } from 'react';
import MetaData from '../layouts/MetaData';

const NotFound = () => {
	return (
		<Fragment>
			<MetaData title={'Not Found'} />
			<div className="row justify-content-center mb-4">
				<div className="col-6 mt-5 text-center not-found-image">
					<img
						src={`/images/404.svg`}
						alt=""
						className="mt-4  img-fluid d-block mx-auto "
					/>
					<h3>Page Not Found</h3>
				</div>
			</div>
		</Fragment>
	);
};

export default NotFound;
