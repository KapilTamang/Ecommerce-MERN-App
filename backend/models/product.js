const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter product name'],
		trim: true,
		maxLength: [100, 'Product name cannot exceed 100 character.'],
	},
	price: {
		type: Number,
		required: [true, 'Please enter product price'],
		maxLength: [5, 'Product price cannot exceed 5 characters'],
		default: 0.0,
	},
	description: {
		type: String,
		required: [true, 'Please enter product description'],
	},
	images: [
		{
			id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		},
	],
	category: {
		type: String,
		required: [true, 'Please select category for this product'],
		enum: {
			values: [
				'Electronics',
				'Electronic Accessories',
				'Fashion',
				'Beauty and Health',
				'Sports and Outdoors',
				'Home Appliances',
				'Books',
			],
			message: 'Please select correct category for this product',
		},
	},
	seller: {
		type: String,
		required: [true, 'Please enter product seller'],
	},
	stock: {
		type: Number,
		required: [true, 'Please enter product stock'],
		maxLength: [5, 'Procduct stock cannot exceed 5 characters'],
		default: 0,
	},
	ratings: {
		type: Number,
		default: 0,
	},
	noOfReviews: {
		type: Number,
		default: 0,
	},
	reviews: [
		{
			name: {
				type: String,
				required: true,
			},
			ratings: {
				type: Number,
				required: true,
			},
			avatar: {
				type: String,
				required: false,
			},
			comment: {
				type: String,
				required: true,
			},
			user: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'User',
			},
		},
	],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Product', productSchema);
