import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';
import Autocomplete from 'react-autocomplete';

import {H3, H4, P} from '../../../utils/content';
import FormElem from '../../../components/FormElem';

import {CREATE_QUOTE} from '../../../utils/mutations';

class CreateQuoteForm extends React.Component {
	state = {
		createNewCustomer: false,
		selectedCustomer: '',
	};

	render() {
		const {customers, onCreate} = this.props;
		const {createNewCustomer, selectedCustomer} = this.state;

		return (
			<Mutation mutation={CREATE_QUOTE}>
				{createQuote => (
					<Formik
						initialValues={{
							customer: '',
							name: '',
							email: '',
							vat: '',
							number: '',
							street: '',
							city: '',
							country: '',
						}}
						validationSchema={Yup.object().shape({
							customer: Yup.string(),
							name: Yup.string(),
							email: Yup.string().email(),
							vat: Yup.string(),
							number: Yup.string(),
							street: Yup.string(),
							city: Yup.string(),
							country: Yup.string(),
						})}
						onSubmit={async (values, actions) => {
							const customer = customers.find(
								c => c.name === selectedCustomer,
							);

							if (!customer && !createNewCustomer) {
								this.setState({
									createNewCustomer: true,
								});
								return;
							}

							const variables = {};

							if (customer) {
								variables.customerId = customer.id;
							}
							else {
								variables.customer = {
									...values,
								};
							}

							const newQuote = await createQuote({
								variables,
							});

							onCreate(newQuote);
						}}
					>
						{props => (
							<div>
								<form onSubmit={props.handleSubmit}>
									<H3>Create your quote</H3>
									<Autocomplete
										getItemValue={customer => customer.name}
										items={customers}
										shouldItemRender={(customer, value) => customer.name.includes(value)
										}
										renderItem={(
											customer,
											isHighlighted,
										) => (
											<div
												style={{
													background: isHighlighted
														? 'lightgray'
														: 'white',
												}}
											>
												{customer.name}
											</div>
										)}
										value={selectedCustomer}
										onChange={(e) => {
											this.setState({
												createNewCustomer: false,
												selectedCustomer:
													e.target.value,
											});
										}}
										onSelect={(value) => {
											this.setState({
												selectedCustomer: value,
											});
										}}
									/>
									{createNewCustomer && (
										<div>
											<H4>
												Congrats, it seems that's a
												fresh new client!
											</H4>
											<p>
												Could you please tell us more
												about it?
											</p>

											<FormElem
												{...props}
												label="Name"
												name="name"
												placeholder="Name"
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
												label="Number"
												name="number"
												placeholder="221B"
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
										{createNewCustomer
											? 'Create Client and Quote'
											: 'Create Quote'}
									</button>
								</form>
							</div>
						)}
					</Formik>
				)}
			</Mutation>
		);
	}
}

export default CreateQuoteForm;
