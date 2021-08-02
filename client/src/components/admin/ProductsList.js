import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Sidebar from './Sidebar';
import NotFound from '../layouts/NotFound';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAdminProducts,
	deleteProduct,
	clearErrors,
} from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import ProcessLoader from '../layouts/ProcessLoader';
import ConfirmModal from '../layouts/ConfirmModal';

const ProductsList = () => {
	const [currentPage, setCurrentPage] = useState(1);

	const [perPage, setPerPage] = useState(8);

	const [keyword, setKeyword] = useState('');

	const [id, setId] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const {
		error,
		loading,
		products,
		resPerPage,
		productsCount,
		filteredProductsCount,
	} = useSelector((state) => state.products);

	const {
		error: deleteError,
		loading: deleteLoading,
		isDeleted,
	} = useSelector((state) => state.product);

	useEffect(() => {
		dispatch(getAdminProducts(keyword, currentPage, perPage));

		if (error) {
			alert.error(error);
			dispatch(clearErrors);
		}

		if (deleteError) {
			alert.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			alert.success('Product deleted successfully');
			dispatch({
				type: DELETE_PRODUCT_RESET,
			});
		}
	}, [
		dispatch,
		alert,
		error,
		deleteError,
		isDeleted,
		currentPage,
		keyword,
		perPage,
	]);

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}

	let count;

	if (keyword) {
		count = filteredProductsCount;
	} else {
		count = productsCount;
	}

	//Delete Product Method Call
	const deleteProductHandler = (id) => {
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

		dispatch(deleteProduct(id));
	};

	//Show Confirmation Dialog
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
			<MetaData title={'All Products'} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'viewAll'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10 pe-5">
					<h2 className="my-4 title-dashboard">All Products</h2>
					<div className="row d-flex">
						<div className="col-6 col-md-5 col-lg-4 col-xl-3">
							<input
								className="form-control search-dashboard"
								type="search"
								value={keyword}
								placeholder="Enter Product Name"
								onChange={(e) => setKeyword(e.target.value)}
							/>
						</div>
						<div className="col-6 col-md-2 col-lg-4 col-xl-6"></div>
						<div className="col-6 col-md-5 col-lg-4 col-xl-3 entries-dashboard d-flex justify-content-center align-items-center">
							Show
							<select
								name="perPage"
								id="perpage_field"
								className="form-select mx-2"
								value={perPage}
								onChange={(e) => setPerPage(e.target.value)}
								disabled={
									!loading && products && products.length === 0 ? true : false
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
					</div>
					{loading ? (
						<Loader />
					) : !loading && products && products.length === 0 ? (
						<Fragment>
							<NotFound image={'empty_product'} msg={'Prodcuct Not Found'} />
						</Fragment>
					) : (
						<Fragment>
							<div className="table-responsive table-dashboard mb-5">
								<table class="table table-striped table-bordered table-hover shadow mt-4">
									<thead>
										<tr>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Product ID
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Name
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Price
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Stock
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{products &&
											products.map((product) => (
												<tr key={product._id}>
													<th scope="row" style={{ padding: '0.6rem 2rem' }}>
														{product._id}
													</th>
													<td style={{ padding: '0.6rem 2rem' }}>
														{product.name}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														${product.price}
													</td>
													<td
														className={
															product.stock === 0
																? 'text-danger'
																: 'text-success'
														}
														style={{ padding: '0.6rem 2rem' }}
													>
														{product.stock}
													</td>
													<td className="text-center">
														<Link
															to={`/admin/products/${product._id}`}
															className="btn btn-edit py-1 px-1 ms-2"
														>
															<i className="fas fa-edit"></i>
														</Link>
														<Link
															className="btn btn-delete py-1 px-1 ms-1"
															onClick={() => showDialog(product._id)}
														>
															<i className="fas fa-trash" />
														</Link>
													</td>
												</tr>
											))}
									</tbody>
								</table>
								{resPerPage < count && (
									<div className="d-flex justify-content-end mt-4">
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
							</div>
							{deleteLoading && <ProcessLoader />}
						</Fragment>
					)}
					<ConfirmModal
						msg={'Are you sure to delete?'}
						confirmHandler={deleteProductHandler}
						id={id}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default ProductsList;
