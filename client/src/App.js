import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/Home';
//Cart Imports
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
//Order Imports
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';

import ProductDetails from './components/product/ProductDetails';

//Auth or User Imports
import Profile from './components/user/Profile';
import Login from './components/user/Login';
import Register from './components/user/Register';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import VerifyEmailRequest from './components/user/VerifyEmailRequest';
import VerifyEmail from './components/user/VerifyEmail';

//Admin Imports
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';

import ProtectedRoute from './components/route/ProtectedRoute';
import { loadUser, clearErrors } from './actions/userAction';
import Preloader from './components/layouts/Preloader';
import store from './store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';

function App() {
	const [stripeApiKey, setStripeApiKey] = useState('');
	useEffect(() => {
		store.dispatch(loadUser());
		store.dispatch(clearErrors());

		async function getStripeApiKey() {
			const res = await axios.get('/api/v1/stripeapi');

			setStripeApiKey(res.data.stripeApiKey);
		}
		getStripeApiKey();
		//eslint-disable-next-line
	}, []);

	const { loading, user, isAuthenticated } = useSelector((state) => state.auth);

	return (
		<Router>
			<div className="App">
				<Preloader />
				<Header />
				<div className="container container-fluid">
					<Route path="/" component={Home} exact />
					<Route path="/search/:keyword" component={Home} exact />
					<Route path="/product/:id" component={ProductDetails} exact />

					<Route path="/cart" component={Cart} exact />
					<ProtectedRoute path="/shipping" component={Shipping} />
					<ProtectedRoute
						path="/orders/confirm"
						component={ConfirmOrder}
						exact
					/>
					<ProtectedRoute
						path="/orders/success"
						component={OrderSuccess}
						exact
					/>
					{stripeApiKey && (
						<Elements stripe={loadStripe(stripeApiKey)}>
							<ProtectedRoute path="/payment" component={Payment} />
						</Elements>
					)}

					<Route path="/email/verify" component={VerifyEmailRequest} exact />
					<Route path="/email/verify/:token" component={VerifyEmail} exact />

					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/password/forgot" component={ForgotPassword} exact />
					<Route
						path="/password/reset/:token"
						component={ResetPassword}
						exact
					/>
					<ProtectedRoute path="/me" component={Profile} exact />
					<ProtectedRoute path="/me/update" component={UpdateProfile} exact />
					<ProtectedRoute
						path="/password/update"
						component={UpdatePassword}
						exact
					/>
					<ProtectedRoute path="/orders/me" component={ListOrders} exact />
					<ProtectedRoute path="/order/:id" component={OrderDetails} exact />
				</div>

				<ProtectedRoute
					path="/dashboard"
					isAdmin={true}
					component={Dashboard}
					exact
				/>
				<ProtectedRoute
					path="/admin/products"
					isAdmin={true}
					component={ProductsList}
					exact
				/>
				<ProtectedRoute
					path="/admin/product"
					isAdmin={true}
					component={NewProduct}
					exact
				/>
				<ProtectedRoute
					path="/admin/products/:id"
					isAdmin={true}
					component={UpdateProduct}
					exact
				/>
				<ProtectedRoute
					path="/admin/orders"
					isAdmin={true}
					component={OrdersList}
					exact
				/>
				<ProtectedRoute
					path="/admin/order/:id"
					isAdmin={true}
					component={ProcessOrder}
					exact
				/>
				<ProtectedRoute
					path="/admin/users"
					isAdmin={true}
					component={UsersList}
					exact
				/>
				<ProtectedRoute
					path="/admin/users/:id"
					isAdmin={true}
					component={UpdateUser}
					exact
				/>
				<ProtectedRoute
					path="/admin/reviews"
					isAdmin={true}
					component={ProductReviews}
					exact
				/>

				{!loading && (!isAuthenticated || (user && user.role !== 'admin')) && (
					<Footer />
				)}
			</div>
		</Router>
	);
}

export default App;
