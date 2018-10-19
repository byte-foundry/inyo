import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';
import Select from 'react-select/lib/Creatable';

import {H3, H4} from '../../../utils/content';
import FormElem from '../../../components/FormElem';
import AddressAutocomplete from '../../../components/AddressAutocomplete';

import {templates} from '../../../utils/quote-templates';
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
							template: 'WEBSITE',
							firstName: '',
							lastName: '',
							email: '',
						}}
						validationSchema={Yup.object().shape({
							customer: Yup.string(),
							template: Yup.string().oneOf([
								'WEBSITE',
								'IDENTITY',
							]),
							firstName: Yup.string(),
							lastName: Yup.string(),
							email: Yup.string().email(),
						})}
						onSubmit={async (values, actions) => {
							const customer = customers.find(
								c => c.id === values.customer,
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
									address: {
										street: values.street,
										city: values.city,
										country: values.country,
									},
								};
							}

							const option = {};
							const selectedTemplate = templates.find(
								t => t.name === values.template,
							);

							if (selectedTemplate) {
								option.proposal = selectedTemplate.proposal;
								option.sections = selectedTemplate.sections;
							}

							variables.option = option;

							const result = await createQuote({
								variables,
							});

							onCreate(result.data.createQuote);
						}}
					>
						{(props) => {
							const {values, setFieldValue} = props;
							const selectedCustomer = customers.find(
								c => c.id === props.values.customer,
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
											options={customers.map(
												customer => ({
													...customer,
													label: customer.name,
													value: customer.id,
												}),
											)}
											getOptionValue={option => option.id}
											onChange={(option) => {
												setFieldValue(
													'customer',
													option && option.value,
												);
											}}
											value={values.customer}
											isClearable
										/>
										<select
											name="template"
											defaultValue="WEBSITE"
											onChange={(option) => {
												setFieldValue(
													'template',
													option && option.value,
												);
											}}
										>
											<option value="WEBSITE">
												Website
											</option>
											<option value="IDENTITY">
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

												<AddressAutocomplete
													{...props}
													onChange={
														props.setFieldValue
													}
													name="address"
													placeholder="Write an address here"
													label="Address"
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
