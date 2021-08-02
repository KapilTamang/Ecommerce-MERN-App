import React from 'react';

const Loader = () => {
	return (
		<div className="loader">
			<img
				src="/images/loader.gif"
				alt=""
				className=" mx-auto d-block "
				style={{ width: '90px' }}
			/>
			<p className="lead text-center">Loading...</p>
		</div>
	);
};

export default Loader;
