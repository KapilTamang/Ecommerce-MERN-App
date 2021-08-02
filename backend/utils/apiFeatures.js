const mongoose = require('mongoose');

class ApiFeatures {
	constructor(query, queryStr, caller) {
		this.query = query;
		this.queryStr = queryStr;
		this.caller = caller;
	}

	search() {
		let keyword;
		if (this.caller === 'orders') {
			keyword = this.queryStr.keyword
				? {
						_id: mongoose.Types.ObjectId(this.queryStr.keyword),
				  }
				: {};
		} else {
			keyword = this.queryStr.keyword
				? {
						$or: [
							{
								name: {
									$regex: this.queryStr.keyword,
									$options: 'i',
								},
							},
							{
								email: {
									$regex: this.queryStr.keyword,
									$options: 'i',
								},
							},
						],
				  }
				: {};
		}

		this.query = this.query.find({ ...keyword });
		return this;
	}

	filter() {
		const queryCopy = { ...this.queryStr };

		//Removing fields from query
		const removeFields = ['keyword', 'limit', 'page'];
		removeFields.forEach((el) => delete queryCopy[el]);

		//Advanced filter for price, ratings etc
		let queryStr = JSON.stringify(queryCopy);
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	pagination(resPerPage) {
		let currentPage = Number(this.queryStr.page) || 1;
		let skipPages = resPerPage * (currentPage - 1);

		this.query = this.query
			.limit(resPerPage)
			.skip(skipPages)
			.sort({ createdAt: -1 });

		return this;
	}
}

module.exports = ApiFeatures;
