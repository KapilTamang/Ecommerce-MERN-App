const express = require('express');
const router = express.Router();

const {
	processPayment,
	sendStripeApiKey,
} = require('../controllers/paymentController');

const { isAuthenticatedUser } = require('../middlewares/auth');

//Stripe Payment Process
router.route('/payment/process').post(isAuthenticatedUser, processPayment);

//Send Stripe Api Key
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
