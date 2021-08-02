const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		res.status(err.statusCode).json({
			success: false,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	if (process.env.NODE_ENV === 'PRODUCTION') {
		// // Wrong Mongoose Object ID Error
		if (err.name === 'CastError') {
			const message = `Resource not found. Invalid: ${err.path}`;
			err = new ErrorHandler(message, 404);
		}

		//Handling Mongoose Validation Errors
		if (err.name === 'ValidationError') {
			const message = Object.values(err.errors).map((value) => value.message);
			err = new ErrorHandler(message, 400);
		}

		//Handle Mongoose Duplicate Key Errors
		if (err.code === 11000) {
			const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
			err = new ErrorHandler(message, 400);
		}

		//Handle Wrong JWT Error
		if (err.name === 'JsonWebTokenError') {
			const message = 'JSON Web Token is Invalid. Try Again';
			err = new ErrorHandler(message, 400);
		}

		//Handle Expired JWT Error
		if (err.name === 'TokenExpiredError') {
			const message = 'JSON Web Token has been expired. Try Again';
			err = new ErrorHandler(message, 400);
		}

		res.status(err.statusCode).json({
			success: false,
			message: err.message || 'Internal Server Error',
		});
	}
};
