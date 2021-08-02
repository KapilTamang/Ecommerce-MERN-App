const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');

//Get All Products => /api/v1/products?keyword=something
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
	const resPerPage = 8;

	const productsCount = await Product.countDocuments();

	const apiFeatures = new ApiFeatures(Product.find(), req.query)
		.search()
		.filter();

	let products = await apiFeatures.query;

	const filteredProductsCount = products.length;

	apiFeatures.pagination(resPerPage);

	products = await apiFeatures.query;

	res.status(200).send({
		success: true,
		productsCount,
		resPerPage,
		products,
		filteredProductsCount,
	});
});

//Get All Admin Products => /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
	const resPerPage = Number(req.query.perPage);

	const productsCount = await Product.countDocuments();

	const apiFeatures = new ApiFeatures(Product.find(), req.query).search();

	let products = await apiFeatures.query;

	const filteredProductsCount = products.length;

	apiFeatures.pagination(resPerPage);

	products = await apiFeatures.query;

	res.status(200).send({
		success: true,
		products,
		productsCount,
		resPerPage,
		filteredProductsCount,
	});
});

//Add New Product => /api/v1/products
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
	let images = [];

	//Check If Request Has Single or Muliple Images
	if (typeof req.body.images === 'string') {
		images.push(req.body.images);
	} else {
		images = req.body.images;
	}

	let imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: 'products',
		});

		imagesLinks.push({
			id: result.public_id,
			url: result.secure_url,
		});
	}

	req.body.images = imagesLinks;

	req.body.user = req.user.id;

	const product = await Product.create(req.body);

	res.status(201).json({
		success: true,
		product,
	});
});

//Get Single Product => /api/v1/products/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	const category = product.category;

	const productId = mongoose.Types.ObjectId(req.params.id);

	//Get All Products under same category
	const similarProducts = await Product.aggregate([
		{ $match: { category: category } },
		{ $match: { _id: { $ne: productId } } },
		{ $sample: { size: 4 } },
	]);

	res.status(200).json({
		success: true,
		product,
		similarProducts,
	});
});

//Update Product => /api/v1/products/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	let images = [];

	//Check If Request Has Single or Muliple Images
	if (typeof req.body.images === 'string') {
		images.push(req.body.images);
	} else {
		images = req.body.images;
	}

	if (images !== undefined) {
		//Deleting Old Images Associated with The Product
		for (i = 0; i < product.images.length; i++) {
			const result = await cloudinary.v2.uploader.destroy(product.images[i].id);
		}
		//Storing New Images
		let imagesLinks = [];

		for (i = 0; i < images.length; i++) {
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: 'products',
			});

			imagesLinks.push({
				id: result.public_id,
				url: result.secure_url,
			});
		}

		req.body.images = imagesLinks;
	}

	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		product,
	});
});

//Delete Product => /api/v1/products/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	//Deleting Images Associated With The Product
	for (let i = 0; i < product.images.length; i++) {
		const result = await cloudinary.v2.uploader.destroy(product.images[i].id);
	}

	await product.remove();

	res.status(200).json({
		success: true,
		message: 'Product is deleted',
	});
});

//Create New Review => /api/v1/reviews
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
	const { ratings, comment, productId } = req.body;

	const review = {
		user: req.user._id,
		name: req.user.name,
		avatar: req.user.avatar.url,
		ratings: Number(ratings),
		comment: comment,
	};

	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find(
		(r) => r.user.toString() === req.user.id.toString()
	);

	if (isReviewed) {
		product.reviews.forEach((review) => {
			if (review.user.toString() === req.user.id.toString()) {
				review.comment = comment;
				review.ratings = ratings;
			}
		});
	} else {
		product.reviews.push(review);
		product.noOfReviews = product.reviews.length;
	}

	product.ratings =
		product.reviews.reduce((acc, item) => item.ratings + acc, 0) /
		product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	});
});

//Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
	if (req.query.id === '') {
		return next(new ErrorHandler('Please Enter Product ID.', 404));
	}

	const product = await Product.findById(req.query.id);

	if (!product) {
		return next(
			new ErrorHandler(`Product not found with ID: ${req.query.id}`, 404)
		);
	}

	const reviewsCount = product.reviews.length;

	const resPerPage = Number(req.query.perPage);

	const apiFeatures = new ApiFeatures(
		Product.findById(req.query.id, 'reviews'),
		req.query
	).pagination(resPerPage);

	const reviews = await apiFeatures.query;

	res.status(200).json({
		success: true,
		reviewsCount,
		resPerPage,
		reviews,
	});
});

//Delete Product Review => /api/v1/reviews
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.productId);

	const reviews = product.reviews.filter(
		(review) => review._id.toString() !== req.query.id.toString()
	);

	//Calculating  Rating after deleting a review
	let ratings = 0;

	if (reviews.length > 0) {
		ratings =
			reviews.reduce((acc, item) => item.ratings + acc, 0) / reviews.length;
	} else {
		ratings = 0;
	}

	const noOfReviews = reviews.length;

	await Product.findByIdAndUpdate(
		req.query.productId,
		{
			reviews,
			ratings,
			noOfReviews,
		},
		{
			new: true,
			runValidators: true,
			useFindAndModify: false,
		}
	);

	res.status(200).json({
		success: true,
	});
});
