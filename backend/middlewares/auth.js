const User = require('../models/user');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

//Checks If user Is Authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
	//Check If Token Exists
	const { token } = req.cookies;

	if (!token) {
		return next(new ErrorHandler('Please login to access this resource.', 401));
	}

	const decode = jwt.verify(token, process.env.JWT_SECRET);

	req.user = await User.findById(decode.id);

	next();
});

//Authorizing Roles of an Authenticated User
exports.authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`Role '${req.user.role}' is not allowed to access this resource.`
				)
			);
		}
		next();
	};
};
