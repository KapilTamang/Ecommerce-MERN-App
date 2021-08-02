import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Sidebar from './Sidebar';
import MetaData from '../layouts/MetaData';
import NotFound from '../layouts/NotFound';
import Loader from '../layouts/Loader';
import ProcessLoader from '../layouts/ProcessLoader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser, clearErrors } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';
import ConfirmModal from '../layouts/ConfirmModal';

const UsersList = ({ history }) => {
	const [keyword, setKeyword] = useState('');

	const [currentPage, setCurrentPage] = useState(1);

	const [perPage, setPerPage] = useState(8);

	const [id, setId] = useState('');

	const alert = useAlert();

	const dispatch = useDispatch();

	const { loading, error, users, usersCount, filteredUsersCount, resPerPage } =
		useSelector((state) => state.allUsers);

	const {
		loading: deleteLoading,
		error: deleteError,
		isDeleted,
	} = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(getAllUsers(keyword, currentPage, perPage));

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (deleteError) {
			alert.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			alert.success('User deleted successfully');
			dispatch({
				type: DELETE_USER_RESET,
			});

			history.push('/admin/users');
		}
	}, [
		dispatch,
		alert,
		error,
		deleteError,
		isDeleted,
		history,
		keyword,
		currentPage,
		perPage,
	]);

	let count;

	if (keyword) {
		count = filteredUsersCount;
	} else {
		count = usersCount;
	}

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}

	const deleteUserHandler = (id) => {
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

		dispatch(deleteUser(id));
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
			<MetaData title={'All Users'} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'users'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10 pe-5">
					<h2 className="my-4 dashboard-title">All Users</h2>
					<div className=" row d-flex">
						<div className="col-6 col-md-5 col-lg-4 col-xl-3">
							<input
								className="form-control search-dashboard"
								type="search"
								value={keyword}
								placeholder="Enter Username or Email"
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
									!loading && users && users.length === 0 ? true : false
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
					) : !loading && users && users.length === 0 ? (
						<Fragment>
							<NotFound image={'empty_user'} msg={'User Not Found'} />
						</Fragment>
					) : (
						<Fragment>
							<div className="table-dashboard table-responsive mb-5">
								<table class="table table-striped table-bordered table-hover shadow mt-4">
									<thead>
										<tr>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												User ID
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Name
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Email
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Role
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Joined
											</th>
											<th scope="col" style={{ padding: '0.7rem 2rem' }}>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{users &&
											users.map((user) => (
												<tr key={user._id}>
													<th scope="row" style={{ padding: '0.6rem 2rem' }}>
														{user._id}
													</th>
													<td style={{ padding: '0.6rem 2rem' }}>
														{user.name}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														{user.email}
													</td>
													<td
														style={{ padding: '0.6rem 2rem' }}
														className={
															user && String(user.role).includes('admin')
																? 'text-success'
																: 'text-secondary'
														}
													>
														{user.role}
													</td>
													<td style={{ padding: '0.6rem 2rem' }}>
														{String(user.createdAt).substring(0, 10)}
													</td>
													<td className="text-center">
														<Link
															to={`/admin/users/${user._id}`}
															className="btn btn-edit py-1 px-1 ms-2"
														>
															<i className="fas fa-edit"></i>
														</Link>
														<Link
															className="btn btn-delete py-1 px-1 ms-1"
															onClick={() => showDialog(user._id)}
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
											totalItemsCount={usersCount}
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
						msg={'Are you sure to delete ?'}
						id={id}
						confirmHandler={deleteUserHandler}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default UsersList;
