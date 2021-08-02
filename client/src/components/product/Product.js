import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product, col }) => {
	return (
		<div className={`col-12 col-md-6 col-lg-${col} my-4`}>
			<div className="card p-3 rounded shadow">
				<img
					className="card-img-top mx-auto"
					src={product.images[0].url}
					alt="product_image"
				/>
				<div className="card-body d-flex flex-column">
					<h5 className="card-title">
						<Link to={`/product/${product._id}`}>{product.name}</Link>
					</h5>
					<div className="ratings mt-auto">
						<div className="rating-outer">
							<div
								className="rating-inner"
								style={{ width: `${(product.ratings / 5) * 100}%` }}
							></div>
						</div>
						<span id="no_of_reviews">({product.noOfReviews} Reviews)</span>
					</div>
					<p className="card-text mt-1">
						<strong>${product.price}</strong>
					</p>
					<Link
						to={`/product/${product._id}`}
						id="view_btn"
						className="btn btn-yellow"
					>
						View Details
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Product;
