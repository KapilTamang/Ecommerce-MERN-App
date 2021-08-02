const express = require('express');

const router = express.Router();

const {
	getProducts,
	newProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	createProductReview,
	getProductReviews,
	deleteProductReview,
	getAdminProducts,
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

//Get All Products
router.route('/products').get(getProducts);

//Get All Admin Products
router
	.route('/admin/products')
	.get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);

//Get single product
router.route('/products/:id').get(getSingleProduct);

//Add New Product
router
	.route('/products')
	.post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

//Update Product
router
	.route('/products/:id')
	.put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

//Delete Product
router
	.route('/products/:id')
	.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

//Create New Review
router.route('/reviews').put(isAuthenticatedUser, createProductReview);

//Get Product Reviews
router.route('/reviews').get(getProductReviews);

//Delete Product Review
router.route('/reviews').delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;
