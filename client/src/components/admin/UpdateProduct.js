import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import ProcessLoader from '../layouts/ProcessLoader';
import Sidebar from './Sidebar';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateProduct,
	getProductDetails,
	clearErrors,
} from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';

const UpdateProduct = ({ match, history }) => {
	const [name, setName] = useState('');

	const [price, setPrice] = useState(0);

	const [description, setDescription] = useState('');

	const [category, setCategory] = useState('');

	const [stock, setStock] = useState(0);

	const [seller, setSeller] = useState('');

	const [images, setImages] = useState([]);

	const [oldImages, setOldImages] = useState([]);

	const [imagesPreview, setImagesPreview] = useState([]);

	const categories = [
		'Electronics',
		'Electronic Accessories',
		'Fashion',
		'Beauty and Health',
		'Sports and Outdoors',
		'Home Appliances',
		'Books',
	];

	const alert = useAlert();

	const dispatch = useDispatch();

	const { error, product } = useSelector((state) => state.productDetails);

	const {
		error: updateError,
		isUpdated,
		loading,
	} = useSelector((state) => state.product);

	const productId = match.params.id;

	useEffect(() => {
		if (product && product._id !== productId) {
			dispatch(getProductDetails(productId));
		} else {
			setName(product.name);
			setPrice(product.price);
			setDescription(product.description);
			setCategory(product.category);
			setSeller(product.seller);
			setStock(product.stock);
			setOldImages(product.images);
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (updateError) {
			alert.error(updateError);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success('Prouduct Updated Successfully');
			dispatch({
				type: UPDATE_PRODUCT_RESET,
			});

			history.push('/admin/products');
		}
	}, [
		dispatch,
		alert,
		error,
		isUpdated,
		updateError,
		history,
		product,
		productId,
	]);

	const updateProductHandler = (e) => {
		e.preventDefault();

		const product = {
			name: name,
			price: price,
			description: description,
			category: category,
			seller: seller,
			stock: stock,
			images: [],
		};

		images.forEach((image) => {
			product.images.push(image);
		});

		dispatch(updateProduct(productId, product));
	};

	const onChange = (e) => {
		const files = Array.from(e.target.files);

		setImagesPreview([]);
		setImages([]);
		setOldImages([]);

		files.forEach((file) => {
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.readyState === 2) {
					setImagesPreview((oldArray) => [...oldArray, reader.result]);
					setImages((oldArray) => [...oldArray, reader.result]);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	return (
		<Fragment>
			<MetaData title={'Update Product'} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'products'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10">
					<form
						className="dashboard-form shadow-lg pt-3 pb-5 px-5 my-5"
						onSubmit={updateProductHandler}
					>
						<h2 className="text-center my-4">Update Product</h2>
						<div className="form-group mb-3">
							<label htmlFor="name_field" className="form-label">
								Name
							</label>
							<input
								type="text"
								className="form-control"
								id="name_field"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="price_field" className="form-label">
								Price
							</label>
							<input
								type="number"
								className="form-control"
								id="price_field"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								required
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="description_field" className="form-label">
								Description
							</label>
							<textarea
								name="description"
								className="form-control"
								id="description_field"
								rows="6"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							></textarea>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="category_field" className="form-label">
								Select a Category
							</label>
							<select
								name="category"
								className="form-select"
								id="category_field"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="stock_field" className="form-label">
								Stock
							</label>
							<input
								type="number"
								className="form-control"
								name="stock"
								id="stock_field"
								value={stock}
								onChange={(e) => setStock(e.target.value)}
								required
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="seller_field" className="form-label">
								Seller
							</label>
							<input
								type="text"
								className="form-control"
								name="seller"
								id="seller_field"
								value={seller}
								onChange={(e) => setSeller(e.target.value)}
								required
							/>
						</div>
						<div className="form-group mb-3">
							<label className="form-label">Select Product Images</label>
							<span
								className="text-muted ms-2"
								style={{ fontSize: '0.9rem', fontStyle: 'italic' }}
							>
								(Select multiple images at once)
							</span>
							<div className="custom-file">
								<input
									type="file"
									name="product-images"
									className="form-control custom-file-input"
									id="customFile"
									onChange={onChange}
									multiple
								/>
							</div>
							{oldImages &&
								oldImages.map((image) => (
									<img
										key={image}
										src={image.url}
										alt="Images Preview"
										className="mt-3 me-3"
										width="60"
										style={{ border: '0.01rem solid rgba(207, 207, 207, 1)' }}
									/>
								))}

							{imagesPreview.map((image) => (
								<img
									key={image}
									src={image}
									alt="Images Preview"
									className="mt-3 me-3"
									width="60"
									style={{ border: '0.01rem solid rgba(207, 207, 207, 1)' }}
								/>
							))}
						</div>
						<button
							type="submit"
							className="btn btn-yellow w-100 py-3 mt-3"
							disabled={loading ? true : false}
						>
							UPDATE
						</button>
					</form>
				</div>
			</div>
			{loading && <ProcessLoader />}
		</Fragment>
	);
};

export default UpdateProduct;
