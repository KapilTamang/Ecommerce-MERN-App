const User = require('../models/user');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const ApiFeatures = require('../utils/apiFeatures');

//Register User => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const { name, email, password } = req.body.user;

	let user = await User.findOne({ email });

	if (user) {
		return next(new ErrorHandler('User Already Exist.'));
	}

	const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: 'avatars',
		width: 500,
		crop: 'scale',
	});

	user = await User.create({
		name,
		email,
		password,
		avatar: {
			id: result.public_id,
			url: result.secure_url,
		},
	});

	const emailVerificationToken = user.getEmailVerificationToken();

	await user.save({ validateBeforeSave: false });

	const emailVerificationURL = `${req.protocol}://${req.get(
		'host'
	)}/email/verify/${emailVerificationToken}`;

	const message = `Please click the link below to verify your email<br><br>
					<a href="${emailVerificationURL}" type="button" style="text-decoration: none; border-radius: 0.2rem;
					background-color: #204060;color: white;font-size: 1rem; border: none;padding: 0.5rem 1.5rem; letter-spacing: 2px;">Verify Email</a>
					If you have not requested for this email. Please ignore it <br><br>`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Afnai Pasal Email Verification',
			message,
		});

		sendToken(user, 201, res);
	} catch (error) {
		user.emailVerificationToken = undefined;
		user.emailVerificationTokenExpire = undefined;

		await user.save({ validateBeforeSave: false });
	}
});

//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	//Check If Email and Password is Entered By User
	if (!email || !password) {
		return next(new ErrorHandler('Please enter your email and password', 400));
	}

	//Check If User Is Registered
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorHandler('Invalid Credentials', 401));
	}

	//Check If Password Is Correct
	const isMatched = await user.comparePassword(password);

	if (!isMatched) {
		return next(new ErrorHandler('Invalid Credentials', 401));
	}

	sendToken(user, 200, res);
});

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler('User not found with this email', 404));
	}

	//Generate Reset Token And Save It
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	//Create Reset Password URl
	const resetPasswordURL = `${req.protocol}://${req.get(
		'host'
	)}/password/reset/${resetToken}`;

	const message = `Your password reset link is as follow <br><br> <a type="button" href="${resetPasswordURL}" style="text-decoration: none; border-radius: 0.2rem;
					background-color: #204060;color: white;font-size: 1rem;border: none;padding: 0.5rem 1.5rem; letter-spacing: 2px;">Reset Password<a/> <br><br> If you have not requested for this email. Ignore it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'AFNAI PASAL Password Recovery',
			message,
		});

		res.status(200).json({
			success: true,
			message: 'Password reset link has been sent',
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpire = undefined;

		await user.save({ validateBeforeSave: false });
	}
});

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	//Hash URl Token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordTokenExpire: { $gt: Date.now() },
	});

	console.log(user);

	if (!user) {
		return next(
			new ErrorHandler(
				'Password reset token is invalid or has been expired.',
				400
			)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler('Password donot match'), 400);
	}

	//Set Up New Password
	user.password = req.body.password;

	//Clear reset password token & expire time
	user.resetPasswordToken = undefined;
	user.resetPasswordTokenExpire = undefined;

	await user.save();

	sendToken(user, 200, res);
});

//Email Verification Request  => /api/v1/email/verify
exports.sendEmailVerificationLink = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler('User not found with this email', 404));
	}

	//Generate Email Verification Token and Save it
	const emailVerificationToken = user.getEmailVerificationToken();

	await user.save({ validateBeforeSave: false });

	const emailVerificationURL = `${req.protocol}://${req.get(
		'host'
	)}/email/verify/${emailVerificationToken}`;

	const message = `Please click the link below to verify your email<br><br>
					<a href="${emailVerificationURL}" type="button" style="text-decoration: none; border-radius: 0.2rem;
					background-color: #204060;color: white;font-size: 1rem; border: none;padding: 0.5rem 1.5rem; letter-spacing: 2px;">Verify Email</a>
					If you have not requested for this email. Please ignore it <br><br>`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'AFNAI PASAL Email Verification',
			message,
		});

		res.status(200).json({
			success: true,
			message: 'Email verification link has been sent',
		});
	} catch (error) {
		user.emailVerificationToken = undefined;
		user.emailVerificationTokenExpire = undefined;

		await user.save({ validateBeforeSave: false });
	}
});

//Verify Email => /api/v1/email/verify/:token
exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
	const emailVerificationToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		emailVerificationToken,
		emailVerificationTokenExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler(
				'Email verification token is invalid or has been expired',
				400
			)
		);
	}

	//Set isVerified to True
	user.isVerified = true;

	//Clear Email Verification Token and Expire Time]
	user.emailVerificationToken = undefined;
	user.emailVerificationTokenExpire = undefined;

	await user.save();

	res.status(200).json({
		success: true,
		message: 'Email Verification Successful',
	});
});

//Get Currently logged In User Details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

//Update Currently Logged In User Password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('password');

	const isMatch = await user.comparePassword(req.body.oldPassword);

	if (!isMatch) {
		return next(new ErrorHandler('Old password is incorrect', 400));
	}

	if (req.body.newPassword !== req.body.confirmNewPassword) {
		return next(new ErrorHandler('New password do not match.', 400));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendToken(user, 200, res);
});

//Update currently logged In User Profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
	const userNewData = {
		name: req.body.name,
		email: req.body.email,
	};

	//Updata Avatar
	if (req.body.avatar !== '') {
		const user = await User.findById(req.user.id);

		const image_id = user.avatar.id;

		const res = await cloudinary.v2.uploader.destroy(image_id);

		const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: 'avatars',
			width: 500,
			crop: 'scale',
		});

		userNewData.avatar = {
			id: result.public_id,
			url: result.secure_url,
		};
	}

	const user = await User.findByIdAndUpdate(req.user.id, userNewData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	//TODO: Update User Profile

	res.status(200).json({
		success: true,
	});
});

//Logout User => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: 'Logged Out',
	});
});

//Admin Routes

//Get All Users => /api/v1/admin/users
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
	const resPerPage = Number(req.query.perPage);

	const usersCount = await User.countDocuments();

	const apiFeatures = new ApiFeatures(User.find(), req.query).search();

	let users = await apiFeatures.query;

	const filteredUsersCount = users.length;

	apiFeatures.pagination(resPerPage);

	users = await apiFeatures.query;

	res.status(200).json({
		success: true,
		usersCount,
		filteredUsersCount,
		resPerPage,
		users,
	});
});

//Get User Details => /api/v1/admin/users/:id
exports.getUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHandler(`User not found with ID: ${req.params.id}`),
			404
		);
	}

	res.status(200).json({
		success: true,
		user,
	});
});

//Update User => /api/v1/admin/users/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
	const userNewData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};

	const user = await User.findByIdAndUpdate(req.params.id, userNewData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
	});
});

//Delete User => /api/v1/admin/users/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHandler(`User not found with ID: ${req.params.id}`, 404)
		);
	}

	// Remove avatar from cloud storage
	const imageId = user.avatar.id;
	await cloudinary.v2.uploader.destroy(imageId);

	await user.remove();

	res.status(200).json({
		success: true,
		user,
	});
});
