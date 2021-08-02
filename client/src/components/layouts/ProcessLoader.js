import React from 'react';

const ProcessLoader = () => {
	return (
		<div className="admin-loader d-flex justify-content-center align-items-center shadow-lg">
			<img src="/images/loader2.gif" alt="" width="35px" />
			<span className="ms-3">Processing...</span>
		</div>
	);
};

export default ProcessLoader;
