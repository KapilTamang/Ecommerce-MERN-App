import React, { Fragment, useEffect, useState } from 'react';
import { getProducts, clearErrors } from '../actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Product from './product/Product';
import Loader from '../components/layouts/Loader';
import MetaData from './layouts/MetaData';
import NotFound from './layouts/NotFound';

const { createSliderWithTooltip } = Slider;

const Range = createSliderWithTooltip(Slider.Range);

const Home = ({ match }) => {
	const [currentPage, setCurrentPage] = useState(1);

	const [price, setPrice] = useState([1, 5000]);

	const [category, setCategory] = useState('');

	const [rating, setRating] = useState(0);

	const categories = [
		'All',
		'Electronics',
		'Electronic Accessories',
		'Fashion',
		'Beauty and Health',
		'Sports and Outdoors',
		'Home Appliances',
		'Books',
	];

	const dispatch = useDispatch();

	const alert = useAlert();

	const {
		loading,
		products,
		productsCount,
		resPerPage,
		error,
		filteredProductsCount,
	} = useSelector((state) => state.products);

	const keyword = match.params.keyword;

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		dispatch(getProducts(keyword, currentPage, price, category, rating));
		//eslint-disable-next-line
	}, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}

	let count;

	if (keyword || category) {
		count = filteredProductsCount;
	} else {
		count = productsCount;
	}

	return (
		<Fragment>
			{!keyword && (
				<div className="row ms-1 mt-4 align-items-center">
					<div className="col-auto">
						<select
							name="category"
							id="category_filed"
							className="form-select"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							{categories.map((category) => (
								<option
									key={category}
									value={category === 'All' ? '' : category}
								>
									{category}
								</option>
							))}
						</select>
					</div>
				</div>
			)}
			<div className="container">
				<h2 id="products_heading">Latest Products</h2>
				<div
					style={{
						width: '11rem',
						height: '0.3rem',
						backgroundColor: '#ffcc66',
					}}
				></div>
			</div>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					{!loading && products && products.length === 0 ? (
						<Fragment>
							<MetaData title={'404 - Product not found'} />
							<NotFound image={'empty_product'} msg={'Product Not Found'} />
						</Fragment>
					) : (
						<Fragment>
							<MetaData title={'Buy Cheap & Best Products Online'} />
							<section id="products" className="container ">
								<div className="row">
									{keyword ? (
										<Fragment>
											<div className="col-12 col-md-4 col-lg-3 my-4 ">
												<div className="row px-4">
													<div className="col-12 card">
														<p
															className="ms-1 mt-4 px-2  py-1"
															style={{
																background: '#204060',
																color: '#ffcc66',
																borderRadius: '0.2rem',
															}}
														>
															<i class="fas fa-tags"></i> Price{' '}
														</p>

														<div className="px-5 py-5">
															<Range
																marks={{ 1: '$1', 1000: '$1000' }}
																min={1}
																max={1000}
																defaultValue={[1, 1000]}
																tipFormatter={(value) => `$${value}`}
																tipProps={{
																	placement: 'top',
																	visible: true,
																}}
																value={price}
																onChange={(price) => setPrice(price)}
															/>
														</div>
														<p
															className="ms-1 px-2 mt-2 py-1"
															style={{
																background: '#204060',
																color: '#ffcc66',
																borderRadius: '0.2rem',
															}}
														>
															<i class="fas fa-layer-group"></i> Categories
														</p>
														<ul className="categories-filter ps-2">
															{categories.map((category) => (
																<li
																	className="mt-1 ms-1"
																	style={{
																		listStyleType: 'none',
																		cursor: 'pointer',
																	}}
																	onClick={() => setCategory(category)}
																>
																	{category}
																</li>
															))}
														</ul>
														<p
															className="ms-1 mt-2 px-2  py-1"
															style={{
																background: '#204060',
																color: '#ffcc66',
																borderRadius: '0.2rem',
															}}
														>
															<i class="fas fa-star"></i> Ratings{' '}
														</p>
														<ul className="ratings-filter ps-2">
															{[5, 4, 3, 2, 1].map((star) => (
																<li
																	className="mt-1 ms-1"
																	key={star}
																	style={{
																		listStyleType: 'none',
																		cursor: 'pointer',
																	}}
																	onClick={() => setRating(star)}
																>
																	<div className="rating-outer">
																		<div
																			className="rating-inner"
																			style={{ width: `${star * 20}%` }}
																		></div>
																	</div>
																</li>
															))}
														</ul>
													</div>
												</div>
											</div>
											<div className="col-12 col-md-8 col-lg-9">
												<div className="row px-2">
													{products &&
														products.map((product) => (
															<Product
																key={product._id}
																product={product}
																col={4}
																from={'search'}
															/>
														))}
												</div>
											</div>
										</Fragment>
									) : (
										<Fragment>
											{products &&
												products.map((product) => (
													<Product
														key={product._id}
														product={product}
														col={3}
														from={'main'}
													/>
												))}
										</Fragment>
									)}
								</div>
							</section>
							{resPerPage < count && (
								<div className="d-flex justify-content-center my-5">
									<Pagination
										activePage={currentPage}
										itemsCountPerPage={resPerPage}
										totalItemsCount={productsCount}
										onChange={setCurrentPageNo}
										nextPageText={'Next'}
										prevPageText={'Prev'}
										firstPageText={'First'}
										lastPageText={'Last'}
										itemClass="page-item"
										linkClass="page-link"
									></Pagination>
								</div>
							)}
						</Fragment>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default Home;
