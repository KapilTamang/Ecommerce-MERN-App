import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import {
	getProductDetails,
	createNewReview,
	clearErrors,
} from '../../actions/productAction';
import { addItemToCart } from '../../actions/cartAction';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import Loader from '../layouts/Loader';
// import { Carousel } from 'react-bootstrap';
import MetaData from '../layouts/MetaData';
import ListReviews from '../review/ListReviews';
import ProductRecommendation from './ProductRecommendation';
import ProcessLoader from '../layouts/ProcessLoader';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';

const ProductDetails = ({ match }) => {
	const [quantity, setQuantity] = useState(1);

	const [ratings, setRatings] = useState(0);

	const [comment, setComment] = useState('');

	const [mainImage, setMainImage] = useState('');

	const dispatch = useDispatch();

	const alert = useAlert();

	const { loading, product, error, recommendedProducts } = useSelector(
		(state) => state.productDetails
	);

	const { error: reviewError, success } = useSelector(
		(state) => state.newReview
	);

	const {
		loading: deleteReviewLoading,
		error: deleteReviewError,
		isDeleted,
	} = useSelector((state) => state.review);

	const { user } = useSelector((state) => state.auth);

	const productId = match.params.id;

	useEffect(() => {
		dispatch(getProductDetails(productId));

		setMainImage('');

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (deleteReviewError) {
			alert.error(deleteReviewError);
			dispatch(clearErrors());
		}

		if (reviewError) {
			alert.error(reviewError);
			dispatch(clearErrors());
		}

		if (success) {
			alert.success('Review posted successfully');
			dispatch({
				type: NEW_REVIEW_RESET,
			});
		}

		if (isDeleted) {
			alert.success('Review deleted successfully');
			dispatch({
				type: DELETE_REVIEW_RESET,
			});
		}

		//eslint-disable-next-line
	}, [
		dispatch,
		alert,
		error,
		match.params.id,
		reviewError,
		success,
		alert,
		deleteReviewError,
		isDeleted,
	]);

	const addToCart = () => {
		if (product.stock === 0) {
			alert.error('Sorry! product is Out Of Stock');
		} else {
			dispatch(addItemToCart(match.params.id, quantity));
			alert.success('Item Added to Cart');
		}
	};

	const increaseQty = () => {
		const count = document.querySelector('.count');

		if (count.valueAsNumber >= product.stock) return;

		setQuantity(count.valueAsNumber + 1);
	};

	const decreaseQty = () => {
		const count = document.querySelector('.count');

		if (count.valueAsNumber <= 1) return;

		setQuantity(count.valueAsNumber - 1);
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

	const reviewHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append('ratings', ratings);
		formData.append('comment', comment);
		formData.append('productId', match.params.id);

		dispatch(createNewReview(formData));
	};

	const imageClickHandler = (imgUrl, imgId) => {
		setMainImage(imgUrl);

		const images = document.querySelector('.img-selected');

		if (images) {
			images.classList.remove('img-selected');
		}

		const imgSelected = document.querySelector(`.${CSS.escape(imgId)}`);

		imgSelected.classList.add('img-selected');
	};

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				product && (
					<Fragment>
						<MetaData title={product.name} />
						<div className="row product-details-container d-flex justify-content-around py-3 my-3">
							<div
								className="col-11 col-sm-12 col-md-12 col-lg-4"
								id="product_image"
							>
								<div className="main-image d-flex justify-content-center">
									<img
										className=" d-block w-90 mb-5"
										src={
											mainImage === ''
												? product.images && product.images[0].url
												: mainImage
										}
										alt={product.title}
										height="350px"
									/>
								</div>
								<div
									style={{
										width: '100%',
										height: '0.1rem',
										background: 'rgba(117, 117, 117, 0.2)',
									}}
								></div>
								<div className="d-flex justify-content-center my-3">
									{product.images &&
										product.images.map((image) => (
											<img
												key={image._id}
												className={`me-3 p-2 sub-image ${image._id}`}
												src={image.url}
												alt={product.title}
												width="90px"
												onClick={() => imageClickHandler(image.url, image._id)}
											/>
										))}
									<hr />
								</div>
								<div
									style={{
										width: '100%',
										height: '0.1rem',
										background: 'rgba(117, 117, 117, 0.2)',
									}}
								></div>
							</div>
							<div className="col-lg-1"></div>
							<div className="col-11 col-sm-12 col-md-12 col-lg-6 mt-5 px-5 py-5 card product-detail shadow-lg">
								<h4>{product.name}</h4>
								<p id="product_id">Product # {product._id}</p>
								<hr />
								<div className="ratings">
									<div className="rating-outer">
										<div
											className="rating-inner"
											style={{ width: `${(product.ratings / 5) * 100}%` }}
										></div>
									</div>
									<span className="ms-2 text-muted">
										(
										{product.ratings && product.ratings > 0
											? `${product.ratings.toFixed(1)}/5.0`
											: '0 Rating'}
										)
									</span>
								</div>
								<span id="no_of_reviews">({product.noOfReviews} Reviews)</span>

								<hr />

								<p id="product_price">${product.price}</p>
								<div className="stockCounter d-inline">
									<span className="btn btn-danger minus" onClick={decreaseQty}>
										-
									</span>
									<input
										type="number"
										className="form-control count d-inline"
										value={quantity}
										readOnly
									/>
									<span className="btn btn-success plus" onClick={increaseQty}>
										+
									</span>
									<buton
										className="add-to-cart-btn btn btn-yellow mt-3 mt-sm-0 ms-sm-4"
										onClick={addToCart}
										disabled={product && product.stock === 0}
									>
										Add to cart
									</buton>
								</div>

								<hr />

								<p>
									Status:{' '}
									<span
										id="stock_status"
										className={
											product.stock > 0 ? 'text-success' : 'text-danger'
										}
									>
										{product.stock > 0 ? 'In Stock' : 'Out of Stock'}
									</span>
								</p>

								<hr />

								<h5 className="mt-2">
									<strong>Description</strong>
								</h5>

								<p>{product.description}</p>

								<hr />

								<p id="product_seller" className="mb-3">
									Seller: <strong>{product.seller}</strong>
								</p>
								{user ? (
									<button
										type="button"
										className="btn btn-yellow w-100 mt-4"
										data-bs-toggle="modal"
										data-bs-target="#ratingModal"
										onClick={setUserRatings}
									>
										Submit Your Review
									</button>
								) : (
									<div className="alert alert-warning mt-4" role="alert">
										Login to Post Your Review.
									</div>
								)}
							</div>
							<div className="row my-3 mt-2">
								{product.reviews && product.reviews.length > 0 && (
									<ListReviews
										reviews={product.reviews}
										productId={productId}
									/>
								)}
							</div>
							<div className="my-3 mt-4">
								<ProductRecommendation
									recommendedProducts={recommendedProducts}
									productId={productId}
								/>
							</div>
						</div>

						{/* Review Modal */}

						<div
							className="modal fade"
							id="ratingModal"
							tabIndex="-1"
							role="dialog"
							aria-labelledby="ratingModalLabel"
							aria-hidden="true"
						>
							<div className="modal-dialog" role="document">
								<div className="modal-content">
									<div className="modal-header">
										<h5 className="modal-title" id="ratingModalLabel">
											Submit Review
										</h5>
										<button
											className="btn-close"
											data-bs-dismiss="modal"
											aria-label="Close"
										></button>
									</div>
									<div className="modal-body">
										<ul className="stars">
											<li className="star">
												<i className="fa fa-star"></i>
											</li>
											<li className="star">
												<i className="fa fa-star"></i>
											</li>
											<li className="star">
												<i className="fa fa-star"></i>
											</li>
											<li className="star">
												<i className="fa fa-star"></i>
											</li>
											<li className="star">
												<i className="fa fa-star"></i>
											</li>
										</ul>
										<textarea
											name="review"
											id="review"
											className="form-control mt-3"
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										></textarea>
										<button
											className="btn btn-yellow my-3 float-right review-btn px-4"
											data-bs-dismiss="modal"
											aria-label="Close"
											disabled={!ratings || !comment}
											onClick={reviewHandler}
										>
											Submit
										</button>
									</div>
								</div>
							</div>
						</div>
						{deleteReviewLoading && <ProcessLoader />}
					</Fragment>
				)
			)}
		</Fragment>
	);
};

export default ProductDetails;
