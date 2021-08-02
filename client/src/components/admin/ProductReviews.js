import React, { Fragment, useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import Sidebar from './Sidebar';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import ProcessLoader from '../layouts/ProcessLoader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	getProductReviews,
	deleteReview,
	clearErrors,
} from '../../actions/productAction';
import {
	GET_REVIEWS_RESET,
	DELETE_REVIEW_RESET,
} from '../../constants/productConstants';
import ConfirmModal from '../layouts/ConfirmModal';

const ProductReviews = ({ history }) => {
	const [keyword, setKeyword] = useState('');

	const [currentPage, setCurrentPage] = useState(1);

	const [perPage, setPerPage] = useState(2);

	const [id, setId] = useState('');

	const [productId, setProductId] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, error, reviews, reviewsCount, resPerPage } = useSelector(
		(state) => state.productReviews
	);

	const {
		loading: deleteLoading,
		error: deleteError,
		isDeleted,
	} = useSelector((state) => state.review);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (deleteError) {
			alert.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			alert.success('Review deleted successfully');
			dispatch({
				type: DELETE_REVIEW_RESET,
			});
			dispatch(getProductReviews(productId, keyword, currentPage, perPage));
		}
	}, [dispatch, error, alert, deleteError, isDeleted, history, productId]);

	// function setCurrentPageNo(pageNumber) {
	// 	setCurrentPage(pageNumber);
	// }

	const getProductReviewsHandler = (e) => {
		e.preventDefault();
		dispatch(getProductReviews(productId, keyword, currentPage, perPage));
	};

	const reviewsResetHandler = (e) => {
		e.preventDefault();

		setProductId('');

		dispatch({
			type: GET_REVIEWS_RESET,
		});
	};

	const deleteReviewHandler = (id) => {
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

		dispatch(deleteReview(id, productId));

		history.push('/admin/reviews');
	};

	const showDialog = (id) => {
		setId(id);

		const confirmationDialog = document.querySelector('.confirmation-dialog');

		confirmationDialog.classList.remove('hide-dialog');

		setTimeout(function () {
			confirmationDialog.classList.remove('visually-hide-dialog');
		}, 20);
	};

	return (
		<Fragment>
			<MetaData title={'Product Reviews'} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'reviews'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10 pe-5">
					<div className="row justify-content-center mt-5">
						<div className="col-8 col-sm-6 col-md-6 col-lg-5 col-xl-4">
							<form
								onSubmit={getProductReviewsHandler}
								className="shadow-lg px-4 py-4"
							>
								<div className="form-group mb-3">
									<input
										type="text"
										id="email_field"
										class="form-control"
										placeholder="Enter Product ID"
										value={productId}
										onChange={(e) => setProductId(e.target.value)}
									/>
								</div>
								<div className="d-flex justify-content-center">
									<button type="submit" className="btn btn-yellow w-100 me-4">
										SEARCH
									</button>
									<button
										className="btn btn-blue w-100"
										onClick={reviewsResetHandler}
									>
										RESET
									</button>
								</div>
							</form>
						</div>
					</div>
					{loading ? (
						<Loader />
					) : reviews && reviews.length === 0 ? (
						<Fragment>
							<h4 className="text-center mt-5">No Reviews</h4>
						</Fragment>
					) : (
						<Fragment>
							{/* <div className=" row d-flex">
								<div className="col-12 col-md-4 d-flex">
									<input
										className="form-control me-2"
										type="search"
										// value={searchText}
										placeholder="Enter Order ID"
										// onChange={(e) => setSearchText(e.target.value)}
									/>
									<button
										class="btn btn-blue btn-sm me-2 shadow"
										// onClick={searchHandler}
									>
										<i class="fas fa-search"></i>
									</button>
									<button
										class="btn btn-yellow btn-sm shadow"
										// onClick={resetSearchHandler}
									>
										<i class="fas fa-undo-alt"></i>
									</button>
								</div>
								<div className="col-12 col-md-5"></div>
								<div className="col-12 col-md-3 d-flex justify-content-center align-items-center">
									Show
									<select
										name="perPage"
										id="perpage_field"
										className="form-select mx-2"
										value={perPage}
										onChange={(e) => setPerPage(e.target.value)}
										disabled={
											!loading && reviews && reviews.length === 0 ? true : false
										}
									>
										<option value="6">6</option>
										<option value="8">8</option>
										<option value="10">10</option>
										<option value="12">12</option>
										<option value="14">14</option>
									</select>{' '}
									Records
								</div>
							</div> */}
							<div className="table-responsive table-dashboard mb-5">
								<table class="table table-striped table-bordered table-hover shadow mt-4">
									<thead>
										<tr>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Review ID
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Ratings
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Comment
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												User
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{reviews &&
											reviews.map((review) => (
												<tr key={review._id}>
													<th scope="row" style={{ padding: '0.6rem 2rem' }}>
														{review._id}
													</th>
													<td style={{ padding: '0.6rem 2rem' }}>
														{review.ratings}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														{review.comment}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														{review.name}
													</td>
													<td className="text-center">
														<button
															className="btn btn-delete py-1 px-1 ms-1"
															onClick={() => showDialog(review._id)}
														>
															<i className="fas fa-trash" />
														</button>
													</td>
												</tr>
											))}
									</tbody>
								</table>
								{/* {resPerPage < reviewsCount && (
									<div className="d-flex justify-content-end mt-4">
										<Pagination
											activePage={currentPage}
											itemsCountPerPage={resPerPage}
											totalItemsCount={reviewsCount}
											onChange={setCurrentPageNo}
											nextPageText={'Next'}
											prevPageText={'Prev'}
											firstPageText={'First'}
											lastPageText={'Last'}
											itemClass="page-item"
											linkClass="page-link"
										></Pagination>
									</div>
								)} */}
							</div>
							<ConfirmModal
								msg={'Are you sure to delete ?'}
								confirmHandler={deleteReviewHandler}
								id={id}
							/>
							{deleteLoading && <ProcessLoader />}
						</Fragment>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default ProductReviews;
