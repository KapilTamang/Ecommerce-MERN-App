const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

//Create New Order => /api/v1/orders
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
	const {
		shippingInfo,
		orderItems,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo,
	} = req.body;

	const order = await Order.create({
		shippingInfo,
		orderItems,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo,
		paidAt: Date.now(),
		user: req.user._id,
	});

	res.status(200).json({
		success: true,
		order,
	});
});

//Get Single Order => /api/v1/order/:id
//TODO logged In User must be able to get only his/her order unless he/she is admin...should not be able to get single order of other user
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name eamil'
	);

	if (!order) {
		return next(new ErrorHandler(`Order not found with ID: ${req.params.id}`));
	}

	res.status(200).json({
		success: true,
		order,
	});
});

//Get All Orders of Logged In User=> /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.query.keyword);

	if (req.query.keyword && !isValidId) {
		return next(new ErrorHandler('Plesae Enter Valid Order ID.', 400));
	}

	const resPerPage = Number(req.query.perPage);

	const ordersCount = await Order.countDocuments({ user: req.user.id });

	const apiFeatures = new ApiFeatures(
		Order.find({ user: req.user.id }),
		req.query,
		'orders'
	).search();

	let orders = await apiFeatures.query;

	const filteredOrdersCount = orders.length;

	apiFeatures.pagination(resPerPage);

	orders = await apiFeatures.query;

	res.status(200).json({
		success: true,
		orders,
		resPerPage,
		ordersCount,
		filteredOrdersCount,
	});
});

//Get All Orders - ADMIN => /api/v1/admin/orders
exports.getOrders = catchAsyncErrors(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.query.keyword);

	if (req.query.keyword && !isValidId) {
		return next(new ErrorHandler('Plesae Enter Valid Order ID.', 400));
	}

	const resPerPage = Number(req.query.perPage);

	const ordersCount = await Order.countDocuments();

	const apiFeatures = new ApiFeatures(
		Order.find(),
		req.query,
		'orders'
	).search();

	let orders = await apiFeatures.query;

	const filteredOrdersCount = orders.length;

	apiFeatures.pagination(resPerPage);

	orders = await apiFeatures.query;

	let totalAmount = 0;

	orders.forEach((order) => {
		totalAmount += order.totalPrice;
	});

	res.status(200).json({
		success: true,
		ordersCount,
		filteredOrdersCount,
		resPerPage,
		totalAmount,
		orders,
	});
});

//Update Order (Process Order & Product Stock) - ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(
			new ErrorHandler(`Order not found with ID: ${req.params.id}`, 404)
		);
	}

	if (
		(req.body.status === 'Processing' && order.orderStatus === 'Shipped') ||
		(req.body.status === 'Shipped' && order.orderStatus === 'Shipped')
	) {
		return next(new ErrorHandler('You have already shipped this order', 400));
	}

	if (req.body.status === 'Shipped' && order.orderStatus === 'Processing') {
		order.orderItems.forEach(async (item) => {
			updateProductStock(item.product, item.quantity);
		});
	}

	if (order.orderStatus === 'Delivered') {
		return next(new ErrorHandler('You have already delivered this order', 400));
	}

	order.orderStatus = req.body.status;
	order.deliveredAt = Date.now();

	await order.save();

	res.status(200).json({
		success: true,
	});
});

async function updateProductStock(id, quantity) {
	const product = await Product.findById(id);

	product.stock = product.stock - quantity;

	await product.save();
}

//Delete Order - ADMIN => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new ErrorHandler(`Order not found with ID: ${req.params.id}`));
	}

	await order.remove();

	res.status(200).json({
		success: true,
	});
});
