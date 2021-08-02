const express = require('express');

const router = express.Router();

const {
	registerUser,
	loginUser,
	forgotPassword,
	resetPassword,
	getUserProfile,
	updatePassword,
	updateProfile,
	logoutUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
} = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

//Regiser User
router.route('/register').post(registerUser);

//Login User
router.route('/login').post(loginUser);

//Forgot Password
router.route('/password/forgot').post(forgotPassword);

//Reset Password
router.route('/password/reset/:token').put(resetPassword);

//Get User Profile
router.route('/me').get(isAuthenticatedUser, getUserProfile);

//Update Currently Logged In User Password
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

//Update Currently Logged In User Profile
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

//Logout User
router.route('/logout').get(logoutUser);

//Admin Routes

//Get All Users - ADMIN
router
	.route('/admin/users')
	.get(isAuthenticatedUser, authorizeRoles('admin'), getUsers);

//Get User - ADMIN
router
	.route('/admin/users/:id')
	.get(isAuthenticatedUser, authorizeRoles('admin'), getUser);

//Update User - ADMIN
router
	.route('/admin/users/:id')
	.put(isAuthenticatedUser, authorizeRoles('admin'), updateUser);

//Delete User - ADMIN
router
	.route('/admin/users/:id')
	.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
