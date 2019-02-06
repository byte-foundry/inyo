import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import {Mutation} from 'react-apollo';
import {Formik} from 'formik';
import * as Yup from 'yup';
import * as Sentry from '@sentry/browser';

import FormElem from '../FormElem';
import FormSelect from '../FormSelect';

import {
	H3, H4, primaryNavyBlue, FlexRow,
} from '../../utils/content';
import {nonEmpty} from '../../utils/functions';
import {UPDATE_CUSTOMER} from '../../utils/mutations';
import {ReactComponent as Pencil} from '../../utils/icons/pencil.svg';

const ClientAddress = styled('div')`
	margin: 20px 0;
`;

const ClientTitle = styled(H3)`
	font-size: 13px;
	margin: 0;
	margin-bottom: 10px;
	text-transform: uppercase;
	display: flex;
	justify-content: space-between;
`;

const CompanyName = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 7px;
`;

const ContactInfo = styled('div')`
	margin: 0;
	margin-bottom: 6px;
`;

const FormButton = styled('div')`
	margin-left: 10px;
	margin-top: 10px;
	color: ${props => (props.cancel ? 'orange' : 'green')};
	cursor: pointer;
	font-size: 12px;
	&:hover {
		text-decoration: underline;
	}
`;

const FormFlexRow = styled(FlexRow)`
	margin: -17px 0;
`;

const titleEnumToTitle = {
	MONSIEUR: 'M.',
	MADAME: 'Mme',
};

const PencilElem = styled(Pencil)`
	cursor: pointer;
	width: 15px;
	margin-top: -2px;
`;

class CustomerNameAndAddress extends Component {
	state = {};

	render() {
		const {
			name,
			firstName,
			lastName,
			email,
			title,
			phone,
			id: customerId,
		} = this.props.customer;

		return (
			<Mutation mutation={UPDATE_CUSTOMER}>
				{updateCustomerMutation => (
					<ClientAddress>
						<ClientTitle>
							Votre client
							<PencilElem
								onClick={() => this.setState({editing: true})}
							/>
						</ClientTitle>
						{this.state.editing ? (
							<Formik
								initialValues={{
									name,
									email,
									firstName,
									lastName,
									title,
									phone,
								}}
								validationSchema={Yup.object().shape({
									name: Yup.string().required('Requis'),
									email: Yup.string()
										.email('Email invalide')
										.required('Requis'),
									firstName: Yup.string().nullable(),
									lastName: Yup.string().nullable(),
									title: Yup.string().nullable(),
									phone: Yup.string().nullable(),
								})}
								validate={(values) => {
									const errors = {};

									if (
										!values.title
										&& !values.firstName
										&& !values.lastName
									) {
										errors.title
											= 'Remplissez au moins civilité, prénom ou nom';
										errors.firstName
											= 'Remplissez au moins civilité, prénom ou nom';
										errors.lastName
											= 'Remplissez au moins civilité, prénom ou nom';
									}
									if (!values.email) {
										errors.email = 'Requis';
									}

									return errors;
								}}
								onSubmit={async (values, actions) => {
									actions.setSubmitting(false);

									try {
										await updateCustomerMutation({
											variables: {
												id: customerId,
												customer: values,
											},
											refetchQueries: ['getProjectData'],
										});

										this.setState({editing: false});
									}
									catch (customerError) {
										if (
											customerError.networkError
											&& customerError.networkError.result
											&& customerError.networkError.result
												.errors
										) {
											Sentry.captureException(
												customerError.networkError
													.result.errors,
											);
										}
										else {
											Sentry.captureException(
												customerError,
											);
										}
										actions.setSubmitting(false);
										actions.setErrors(customerError);
										actions.setStatus({
											msg: `Quelque chose ne s'est pas passé comme prévu. ${customerError}`,
										});
									}
								}}
							>
								{props => (
									<>
										<FormElem
											{...props}
											name="name"
											label="Nom du client"
											type="text"
											placeholder="Nom du client"
										/>
										<FormFlexRow>
											<FormSelect
												{...props}
												name="title"
												label="Civilité"
												paddedRight
												options={[
													{
														value: undefined,
														label: '',
													},
													{
														value: 'MONSIEUR',
														label: 'M.',
													},
													{
														value: 'MADAME',
														label: 'Mme',
													},
												]}
											/>
											<FormElem
												{...props}
												name="firstName"
												label="Prénom"
												type="text"
												placeholder="Prénom"
											/>
										</FormFlexRow>{' '}
										<FormElem
											{...props}
											name="lastName"
											label="Nom de famille"
											type="text"
											placeholder="Nom de famille"
										/>
										<FormElem
											{...props}
											name="email"
											label="Adresse email"
											type="email"
											placeholder="Adresse email"
										/>
										<FormElem
											{...props}
											name="phone"
											label="Téléphone"
											type="text"
											placeholder="Tél."
										/>
										<FormFlexRow justifyContent="flex-end">
											<FormButton
												cancel
												onClick={(e) => {
													e.stopPropagation();
													this.setState({
														editing: false,
													});
												}}
											>
												Annuler
											</FormButton>
											<FormButton
												onClick={() => {
													props.handleSubmit();
												}}
											>
												Ok
											</FormButton>
										</FormFlexRow>
									</>
								)}
							</Formik>
						) : (
							<>
								<CompanyName>{name}</CompanyName>
								<ContactInfo>
									{nonEmpty` ${
										titleEnumToTitle[title]
									} ${firstName} ${lastName}`.trimRight()}
								</ContactInfo>
								<ContactInfo>{email}</ContactInfo>
								<ContactInfo>{phone}</ContactInfo>
							</>
						)}
					</ClientAddress>
				)}
			</Mutation>
		);
	}
}

export default withRouter(CustomerNameAndAddress);
