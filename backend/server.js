const app = require('./app');

const connectDB = require('./config/db');

const cloudinary = require('cloudinary');

//Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`);
	console.log('Shutting down due to Uncaught Exception');
	process.exit(1);
});

//Setting up config file
if (process.env.NODE_ENV !== 'PRODUCTION')
	require('dotenv').config({ path: 'backend/config/config.env' });

//Database Connection
connectDB();

//Setting up Cloudinary Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
	console.log(
		`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
	);
});

//Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
	console.log(`ERROR: ${err.message}`);
	console.log('Shutting down the server due to unhandled Promise Rejection.');
	server.close(() => {
		process.exit(1);
	});
});
