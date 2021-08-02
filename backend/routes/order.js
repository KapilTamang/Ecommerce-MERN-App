const express = require('express');
const router = express.Router();

const {
	newOrder,
	getSingleOrder,
	myOrders,
	getOrders,
	updateOrder,
	deleteOrder,
} = require('../controllers/orderController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

//Create New Order
router.route('/orders').post(isAuthenticatedUser, newOrder);

//Get Single Order
router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder);

//Get Logged In User's Orders
router.route('/order/me').get(isAuthenticatedUser, myOrders);

//Get All Orders - ADMIN
router
	.route('/admin/orders')
	.get(isAuthenticatedUser, authorizeRoles('admin'), getOrders);

//Update Order - ADMIN
router
	.route('/admin/orders/:id')
	.put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

//Delete Order - ADMIN
router
	.route('/admin/orders/:id')
	.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;
