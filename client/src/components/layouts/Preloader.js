import React from 'react';

const Preloader = () => {
	return (
		<div id="preloader">
			<div>
				<img src="/images/preloader_icon.png" alt="" width="60px" />
				<span
					className="ms-1 text-muted"
					style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}
				>
					<strong> afnai pasal</strong>
				</span>
			</div>
			<img
				src="/images/loader1.gif"
				className="ms-3"
				alt=""
				style={{ marginTop: '-1.8rem' }}
				width="70px"
				height="70px"
			/>
		</div>
	);
};

export default Preloader;
