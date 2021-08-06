import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const ProductRecommendation = ({ recommendedProducts }) => {
	return (
		<div className="row">
			<div className="col-11 col-sm-12 col-md-12 mt-3">
				<h3>Similar Products</h3>
				<div
					style={{
						width: '11rem',
						height: '0.3rem',
						backgroundColor: '#ffcc66',
					}}
				></div>
			</div>
			{recommendedProducts && recommendedProducts.length === 0 ? (
				<h4 className="text-center mt-5 text-muted">
					<i class="fas fa-frown"></i>&nbsp; No Products to Suggest.
				</h4>
			) : (
				<Fragment>
					{recommendedProducts &&
						recommendedProducts.map((product) => (
							<div className="col-12 col-md-6 col-lg-4 col-xl-3 my-4">
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
											<span id="no_of_reviews">
												({product.noOfReviews} Reviews)
											</span>
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
						))}
				</Fragment>
			)}
		</div>
	);
};

export default ProductRecommendation;
