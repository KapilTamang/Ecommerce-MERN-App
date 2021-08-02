import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../../actions/cartAction';
import { countries } from 'countries-list';
import MetaData from '../layouts/MetaData';
import CheckoutSteps from './CheckoutSteps';

const Shipping = ({ history }) => {
	const countriesList = Object.values(countries);

	const { shippingInfo } = useSelector((state) => state.cart);
	const [address, setAddress] = useState(shippingInfo.address);
	const [city, setCity] = useState(shippingInfo.city);
	const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
	const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
	const [country, setCountry] = useState(shippingInfo.country);

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();

		dispatch(saveShippingInfo({ address, city, postalCode, phoneNo, country }));
		history.push('/orders/confirm');
	};

	return (
		<Fragment>
			<MetaData title="Shipping Info" />
			<CheckoutSteps shipping />
			<div className="container container-fluid">
				<div className="row wrapper my-4">
					<div className="col-11 col-md-8 col-lg-6 col-xl-5">
						<form onSubmit={submitHandler} className="mb-4 shadow-lg">
							<p
								className="mb-3 text-center"
								style={{ color: '#204060', fontSize: '1.5rem' }}
							>
								Shipping Info
							</p>
							<div className="mb-3">
								<label htmlFor="address" className="form-label">
									Address
								</label>
								<input
									type="text"
									id="address_field"
									className="form-control"
									name="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="city" className="form-label">
									City
								</label>
								<input
									type="text"
									id="city_field"
									className="form-control"
									name="city"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="postalCode" className="form-label">
									Postal Code
								</label>
								<input
									type="number"
									id="postalCode_field"
									className="form-control"
									name="postalCode"
									value={postalCode}
									onChange={(e) => setPostalCode(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="phoneNo" className="form-label">
									Phone No
								</label>
								<input
									type="phone"
									id="phoneNo_field"
									className="form-control"
									name="phoneNo"
									value={phoneNo}
									onChange={(e) => setPhoneNo(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="country" className="form-label">
									Country
								</label>
								<select
									type="text"
									id="country_field"
									className="form-control"
									name="country"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									required
								>
									{' '}
									{countriesList.map((country) => (
										<option key={country.name} value={country.name}>
											{country.name}
										</option>
									))}
								</select>
							</div>
							<button
								type="submit"
								className="w-100 btn btn-yellow btn-lg py-2 mt-4"
							>
								Continue
							</button>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Shipping;
