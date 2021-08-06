import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeMenu }) => {
	const showMenu = () => {
		const sideBar = document.querySelector('.sidebar-wrapper');

		const openIcon = document.querySelector('.open-icon');

		const closeIcon = document.querySelector('.close-icon');

		if (sideBar.classList.contains('hide-sidebar')) {
			setTimeout(function () {
				sideBar.classList.remove('visually-hide-sidebar');
			}, 5);
			sideBar.classList.remove('hide-sidebar');

			openIcon.classList.remove('show-icon');
			closeIcon.classList.remove('hide-icon');
		} else {
			sideBar.classList.add('visually-hide-sidebar');
			sideBar.classList.add('hide-sidebar');
			openIcon.classList.add('show-icon');
			closeIcon.classList.add('hide-icon');
		}
	};

	return (
		<Fragment>
			<span className="menu-icon-container">
				<i
					type="button"
					class="menu-icon open-icon show-icon d-flex justify-content-center align-items-center fas fa-bars"
					onClick={showMenu}
				></i>
				<i
					type="button"
					class="menu-icon close-icon hide-icon d-flex justify-content-center align-items-center fas fa-times"
					onClick={showMenu}
				></i>
			</span>
			<div className="sidebar-wrapper hide-sidebar visually-hide-sidebar">
				<nav id="sidebar">
					<ul className="list-unstyled components">
						<li className={activeMenu === 'dashboard' ? 'active' : ''}>
							<Link to="/dashboard">
								<i className="fas fa-tachometer-alt"></i> Dashboard
							</Link>
						</li>
						<li className={activeMenu === 'products' ? 'active' : ''}>
							<a
								href="#productSubMenu"
								data-bs-toggle="collapse"
								aria-expanded="false"
								className="dropdown-toggle"
							>
								<i className="fab fa-product-hunt"></i> Products &nbsp;
							</a>
							<ul className="collapse list-unstyled" id="productSubMenu">
								<li className={activeMenu === 'viewAll' ? 'active' : ''}>
									<Link to="/admin/products">
										<i className="fas fa-layer-group"></i> View All
									</Link>
								</li>
								<li className={activeMenu === 'newProduct' ? 'active' : ''}>
									<Link to="/admin/product">
										<i className="fas fa-plus"></i> Create New
									</Link>
								</li>
							</ul>
						</li>
						<li className={activeMenu === 'orders' ? 'active' : ''}>
							<Link to="/admin/orders">
								<i className="fas fa-shopping-basket"></i> Orders
							</Link>
						</li>
						<li className={activeMenu === 'users' ? 'active' : ''}>
							<Link to="/admin/users">
								<i className="fas fa-users"></i> Users
							</Link>
						</li>
						<li className={activeMenu === 'reviews' ? 'active' : ''}>
							<Link to="/admin/reviews">
								<i className="fas fa-star"></i> Reviews
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</Fragment>
	);
};

export default Sidebar;
