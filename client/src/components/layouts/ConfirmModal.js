import React, { Fragment } from 'react';

const ConfirmModal = ({ confirmHandler, id, msg }) => {
	const cancelHandler = () => {
		const confirmationDialog = document.querySelector('.confirmation-dialog');

		confirmationDialog.classList.add('visually-hide-dialog');

		confirmationDialog.addEventListener(
			'transitionend',
			function (e) {
				confirmationDialog.classList.add('hide-dialog');
			},
			{
				capture: false,
				once: true,
				passive: false,
			}
		);
	};

	return (
		<Fragment>
			<div className="row d-flex justify-content-center">
				<div className="confirmation-dialog hide-dialog visually-hide-dialog col-8 col-md-3 text-center  shadow-lg">
					{' '}
					<i className="far fa-question-circle text-center mb-3"></i>
					<h5 className="mb-3">{msg}</h5>
					<div className="d-flex justify-content-center mb-4">
						<button
							className="btn btn-yellow w-100 me-4"
							onClick={() => confirmHandler(id)}
						>
							Confirm
						</button>
						<button className="btn btn-red w-100" onClick={cancelHandler}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ConfirmModal;
