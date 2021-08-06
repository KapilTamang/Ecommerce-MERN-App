import React, { Fragment, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { createNewProduct, clearErrors } from '../../actions/productAction';
import MetaData from '../layouts/MetaData';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import ProcessLoader from '../layouts/ProcessLoader';

const NewProduct = ({ history }) => {
	const [name, setName] = useState('');

	const [price, setPrice] = useState('');

	const [description, setDescription] = useState('');

	const [category, setCategory] = useState('Electronics');

	const [stock, setStock] = useState('');

	const [seller, setSeller] = useState('');

	const [images, setImages] = useState([]);

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

	const { loading, success, error } = useSelector((state) => state.newProduct);

	const alert = useAlert();

	const dispatch = useDispatch();

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (success) {
			history.push('/admin/products');
			alert.success('Product created successfully');
			dispatch({
				type: NEW_PRODUCT_RESET,
			});
		}
	}, [dispatch, error, success, alert, history]);

	const newProductHandler = (e) => {
		e.preventDefault();

		const product = {
			name: name,
			price: price,
			description: description,
			category: category,
			stock: stock,
			seller: seller,
			images: [],
		};

		images.forEach((image) => {
			product.images.push(image);
		});

		dispatch(createNewProduct(product));
	};

	const onChange = (e) => {
		const files = Array.from(e.target.files);

		setImagesPreview([]);
		setImages([]);

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
			<MetaData title={'Create New Product'} />
			<div className="row">
				<div className="col-12 col-md-3 col-lg-3 col-xl-2">
					<Sidebar activeMenu={'newProduct'} />
				</div>
				<div className="col-12 col-md-9 col-lg-9 col-xl-10">
					<form
						className="dashboard-form shadow-lg pt-3 pb-5 px-5 my-5"
						onSubmit={newProductHandler}
					>
						<h2 className="text-center my-4">Create New Product</h2>
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
									required
								/>
							</div>
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
							CREATE
						</button>
					</form>
				</div>
			</div>
			{loading && <ProcessLoader />}
		</Fragment>
	);
};

export default NewProduct;
