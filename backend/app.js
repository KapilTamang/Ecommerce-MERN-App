const express = require('express');
const errorMiddleware = require('./middlewares/errors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(fileUpload());

//Setting Up Config File
if (process.env.NODE_ENV !== 'PRODUCTION')
	require('dotenv').config({ path: 'backend/config/config.env' });

//Import all routes
const product = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');

app.use('/api/v1', product);
app.use('/api/v1', auth);
app.use('/api/v1', payment);
app.use('/api/v1', order);

if (process.env.NODE_ENV === 'PRODUCTION') {
	app.use(express.static(path.join(__dirname, '../client/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
	});
}

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
