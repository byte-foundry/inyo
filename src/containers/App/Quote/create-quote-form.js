import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';
import Select from 'react-select/lib/Creatable';

import {H3, H4, P} from '../../../utils/content';
import FormElem from '../../../components/FormElem';

import {CREATE_QUOTE} from '../../../utils/mutations';

class CreateQuoteForm extends React.Component {
	render() {
		const {customers, onCreate} = this.props;

		return (
			<Mutation mutation={CREATE_QUOTE}>
				{createQuote => (
					<Formik
						initialValues={{
							customer: '',
							template: 'website',
							firstName: '',
							lastName: '',
							email: '',
							vat: '',
							street: '',
							city: '',
							country: '',
						}}
						validationSchema={Yup.object().shape({
							customer: Yup.string(),
							template: Yup.string().oneOf([
								'website',
								'identity',
							]),
							firstName: Yup.string(),
							lastName: Yup.string(),
							email: Yup.string().email(),
							vat: Yup.string(),
							street: Yup.string(),
							city: Yup.string(),
							country: Yup.string(),
						})}
						onSubmit={async (values, actions) => {
							const customer = customers.find(
								c => c.name === values.customer,
							);

							const variables = {
								template: values.template,
							};

							if (customer) {
								variables.customerId = customer.id;
							}
							else {
								variables.customer = {
									name: values.customer,
									firstName: values.firstName,
									lastName: values.lastName,
									email: values.email,
									vat: values.vat,
									address: {
										street: values.street,
										city: values.city,
										country: values.country,
									},
								};
							}

							const result = await createQuote({
								variables,
							});

							onCreate(result.data.createQuote);
						}}
					>
						{(props) => {
							const {values} = props;
							const selectedCustomer = customers.find(
								c => c.name === props.values.customer,
							);
							const newCustomer
								= !selectedCustomer && values.customer;

							return (
								<div>
									<form onSubmit={props.handleSubmit}>
										<H3>Create your quote</H3>
										<label htmlFor="customer">
											Customer
										</label>
										<Select
											id="customer"
											name="customer"
											options={customers}
											getOptionValue={option => option.name
											}
											onChange={(option) => {
												console.log(option);
												props.setFieldValue(
													'customer',
													option && option.value,
												);
											}}
											value={values.customer}
											isClearable
										/>
										<select
											name="template"
											defaultValue="website"
										>
											<option value="website">
												Website
											</option>
											<option value="identity">
												Identity
											</option>
										</select>
										{!selectedCustomer
											&& values.customer && (
											<div>
												<H4>
														Congrats, it seems
														that's a fresh new
														client!
												</H4>
												<p>
														Could you please tell us
														more about it?
												</p>

												<FormElem
													{...props}
													label="Contact Firstname"
													name="firstName"
													placeholder="John"
												/>
												<FormElem
													{...props}
													label="Contact Lastname"
													name="lastName"
													placeholder="Doe"
												/>
												<FormElem
													{...props}
													label="Email address"
													name="email"
													placeholder="contact@company.com"
												/>
												<FormElem
													{...props}
													label="VAT Number"
													name="vat"
													placeholder="FR 152 154 874"
												/>

												<FormElem
													{...props}
													label="Street"
													name="street"
													placeholder="Baker Street"
												/>
												<FormElem
													{...props}
													label="City"
													name="city"
													placeholder="London"
												/>
												<FormElem
													{...props}
													label="Country"
													name="country"
													placeholder="UK"
												/>
											</div>
										)}
										<button type="submit">
											{newCustomer
												? 'Create Client and Quote'
												: 'Create Quote'}
										</button>
										{selectedCustomer && (
											<React.Fragment>
												<H4>
													Some facts about{' '}
													{values.customer}
												</H4>
												<ul>
													<li>
														He's a good guy
														apparently
													</li>
													<li>
														He wants to give you
														money... we guess
													</li>
													<li>
														We hope he pays you back
													</li>
												</ul>
											</React.Fragment>
										)}
									</form>
								</div>
							);
						}}
					</Formik>
				)}
			</Mutation>
		);
	}
}

export default CreateQuoteForm;
