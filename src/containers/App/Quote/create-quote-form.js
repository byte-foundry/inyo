import React from 'react';
import {Formik} from 'formik';
import styled from 'react-emotion';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';
import Creatable from 'react-select/lib/Creatable';
import ClassicSelect from 'react-select';
import {templates} from '../../../utils/quote-templates';

import {
	H1,
	H3,
	H4,
	Button,
	primaryBlue,
	primaryNavyBlue,
	FlexRow,
} from '../../../utils/content';
import FormElem from '../../../components/FormElem';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import {CREATE_QUOTE} from '../../../utils/mutations';

const Title = styled(H1)`
	color: ${primaryNavyBlue};
`;

const SubTitle = styled(H3)`
	color: ${primaryBlue};
`;

const FormTitle = styled(H4)`
	color: ${primaryBlue};
`;

const SelectStyles = {
	option: (base, state) => ({
		...base,
		borderRadius: 0,
		fontFamily: 'Ligne',
	}),
	menu: (base, state) => ({
		...base,
		marginTop: 2,
		borderRadius: 0,
		fontFamily: 'Ligne',
	}),
	control: base => ({
		...base,
		width: '30vw',
		borderRadius: 0,
		fontFamily: 'Ligne',
	}),
	input: (base, state) => ({
		...base,
		fontFamily: 'Ligne',
		marginTop: '5px',
	}),
};

const quoteTemplates = templates.map(template => ({
	value: template.name,
	label: template.label,
}));

quoteTemplates.push({value: 'IDENTITY', label: 'Identité visuelle'});

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
									address: values.address,
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
										<Title>Créez votre devis</Title>
										<FlexRow justifyContent="space-around">
											<div>
												<SubTitle>
													1. Votre client
												</SubTitle>
												<label htmlFor="customer">
													Entrez le nom de votre
													client
												</label>
												<Creatable
													id="customer"
													name="customer"
													options={customers.map(
														customer => ({
															...customer,
															label:
																customer.name,
															value: customer.id,
														}),
													)}
													getOptionValue={option => option.id
													}
													onChange={(option) => {
														setFieldValue(
															'customer',
															option
																&& option.value,
														);
													}}
													styles={SelectStyles}
													value={values.customer}
													isClearable
													placeholder="Marc Dubois"
													formatCreateLabel={inputValue => `Créer "${inputValue}"`
													}
												/>
												{!selectedCustomer
													&& values.customer && (
													<div>
														<FormTitle>
																Il semblerait
																que ce soit un
																nouveau client !
														</FormTitle>
														<p>
																Pourriez-vous
																nous en dire
																plus ?
														</p>

														<FormElem
															{...props}
															label="Son prénom"
															name="firstName"
															placeholder="John"
														/>
														<FormElem
															{...props}
															label="Son nom"
															name="lastName"
															placeholder="Doe"
														/>
														<FormElem
															{...props}
															label="Son email"
															name="email"
															placeholder="contact@company.com"
														/>

														<AddressAutocomplete
															{...props}
															onChange={
																props.setFieldValue
															}
															name="Son addresse"
															placeholder="42 rue du Fer, 75000 Paris"
															label="Address"
														/>
													</div>
												)}
											</div>

											<div>
												<SubTitle>
													2. Votre Projet
												</SubTitle>

												<ClassicSelect
													styles={SelectStyles}
													defaultValue="WEBSITE"
													placeholder="Type de contenu"
													onChange={(option) => {
														setFieldValue(
															'template',
															option
																&& option.value,
														);
													}}
													options={quoteTemplates}
												/>
												<br />
												<br />
												<Button
													type="submit"
													theme="Primary"
													size="Large"
												>
													Commencer à éditer
												</Button>
											</div>
										</FlexRow>
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
