import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../layouts/ConfirmModal';
import { deleteReview } from '../../actions/productAction';

const ListReviews = ({ reviews, productId }) => {
	const [reviewId, setReviewId] = useState('');

	const [ratings, setRatings] = useState(0);

	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);

	const showDialog = (id) => {
		setReviewId(id);

		const confirmationDialog = document.querySelector('.confirmation-dialog');

		confirmationDialog.classList.remove('hide-dialog');

		setTimeout(function () {
			confirmationDialog.classList.remove('visually-hide-dialog');
		}, 20);
	};

	function setUserRatings() {
		const stars = document.querySelectorAll('.star');

		stars.forEach((star, index) => {
			star.starValue = index + 1;

			['click', 'mouseover', 'mouseout'].forEach(function (e) {
				star.addEventListener(e, showRatings);
			});
		});

		function showRatings(e) {
			stars.forEach((star, index) => {
				if (e.type === 'click') {
					if (index < this.starValue) {
						star.classList.add('yellow');

						setRatings(this.starValue);
					} else {
						star.classList.remove('yellow');
					}
				}

				if (e.type === 'mouseover') {
					if (index < this.starValue) {
						star.classList.add('orange');
					} else {
						star.classList.remove('orange');
					}
				}

				if (e.type === 'mouseout') {
					star.classList.remove('orange');
				}
			});
		}
	}

	const reviewDeleteHandler = (reviewId) => {
		const confirmationDialog = document.querySelector('.confirmation-dialog');

		confirmationDialog.classList.add('visually-hide-dialog');

		confirmationDialog.addEventListener(
			'transitionend',
			function (e) {
				confirmationDialog.classList.add('hide-dialog');
			},
			{ capture: false, once: true, passive: false }
		);

		dispatch(deleteReview(reviewId, productId));
	};

	return (
		<div
			className="reviews col-12 w-100 px-5 py-4 mt-5 "
			style={{ border: '2px solid rgba(117, 117, 117, 0.2)' }}
		>
			<h3>Other's review</h3>
			<hr />
			{reviews.length === 0 ? (
				<p>No Reviews Yet</p>
			) : (
				<Fragment>
					{reviews &&
						reviews.map((review) => (
							<div key="review._id" className="my-3">
								<div>
									<img
										src={review.avatar}
										alt="avatar"
										width="35"
										className="me-2"
										style={{ borderRadius: '50%' }}
									/>{' '}
									<span className="review_user">
										{' '}
										<strong>{review.name}</strong>{' '}
									</span>
								</div>
								<div className="rating-outer ms-5">
									<div
										className="rating-inner"
										style={{ width: `${(review.ratings / 5) * 100}%` }}
									></div>
								</div>
								<div className=" ms-5 mt-2">
									{review.comment}
									{user && user._id === review.user && (
										<div className="review-edit-delete mt-3 mb-4">
											<Link
												type="button"
												className="me-3 btn-edit"
												data-bs-toggle="modal"
												data-bs-target="#ratingModal"
												onClick={setUserRatings}
											>
												<i class="far fa-edit"></i> Edit
											</Link>
											<Link
												type="button"
												className="btn-delete"
												onClick={() => showDialog(review._id)}
											>
												<i class="far fa-trash-alt"></i> Delete
											</Link>
										</div>
									)}
								</div>
							</div>
						))}
					<ConfirmModal
						confirmHandler={reviewDeleteHandler}
						id={reviewId}
						msg={'Are you sure to delete review?'}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default ListReviews;
