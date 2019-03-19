import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import {Mutation} from 'react-apollo';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';

import {
	H4,
	FlexRow,
	gray70,
	primaryWhite,
	primaryBlue,
	gray80,
	FlexColumn,
	Button,
	P,
} from '../../utils/content';
import FormElem from '../FormElem';

const OnboardingStep = styled('div')`
	width: 100%;
`;
const ActionButtons = styled(FlexColumn)`
	margin-left: auto;
	margin-right: auto;
`;

const ActionButton = styled(Button)`
	width: 200px;
	margin-top: 15px;
	margin-left: auto;
	margin-right: auto;
`;

const StepSubtitle = styled(H4)`
	text-align: center;
`;

const StepDescription = styled(P)`
	text-align: center;
	color: ${gray70};
	font-size: 15px;
`;

const UseCaseCards = styled(FlexRow)`
	flex-wrap: nowrap;
`;

const UseCaseCard = styled('div')`
	flex: 1;
	margin-bottom: 15px;
	padding: 14px 16px 15px 16px;
	color: ${props => (props.selected ? primaryWhite : gray80)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;

	&:first-child {
		margin-right: 10px;
	}
`;

class OnboardingFifthStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			canBeContacted: false,
		};
	}

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;

		return (
			<OnboardingStep>
				<StepSubtitle>Dernière question !</StepSubtitle>
				<StepDescription>
					Avez-vous un quelques minutes pour nous aider à transformer
					Inyo en l'application de vos rêves?
				</StepDescription>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								canBeContacted: me.canBeContacted,
								phone: '',
							}}
							validate={({canBeContacted, phone}) => {
								const errors = {};

								if (canBeContacted && !phone) {
									errors.phone = 'Requis';
								}

								return errors;
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);

								window.Intercom('update', {
									canBeContacted: values.canBeContacted,
									phone: values.phone,
								});

								try {
									updateUser({
										variables: {
											canBeContacted:
												values.canBeContacted,
											company: {
												phone: values.phone,
											},
										},
										update: (
											cache,
											{data: {updateUser: newUpdateUser}},
										) => {
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = newUpdateUser;
											try {
												cache.writeQuery({
													query: GET_USER_INFOS,
													data,
												});
												getNextStep();
											}
											catch (e) {
												throw e;
											}
										},
									});
								}
								catch (error) {
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg: "Quelque chose s'est mal passé",
									});
								}
							}}
						>
							{(props) => {
								const {
									values,
									errors,
									setFieldValue,
									handleChange,
									handleBlur,
									handleSubmit,
									touched,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<UseCaseCards>
											<UseCaseCard
												selected={values.canBeContacted}
												onClick={() => setFieldValue(
													'canBeContacted',
													true,
												)
												}
											>
												Oui
											</UseCaseCard>
											<UseCaseCard
												selected={
													!values.canBeContacted
												}
												onClick={() => setFieldValue(
													'canBeContacted',
													false,
												)
												}
											>
												Non
											</UseCaseCard>
										</UseCaseCards>
										{values.canBeContacted && (
											<FormElem
												label="Merci! Renseignez svp votre numéro de téléphone"
												errors={errors}
												required
												values={values}
												type="text"
												touched={touched}
												name="phone"
												id="phone"
												handleBlur={handleBlur}
												handleChange={handleChange}
												placeholder="08 36 65 65 65"
											/>
										)}
										<ActionButtons>
											<ActionButton
												theme="Primary"
												size="Medium"
												type="submit"
											>
												Continuer
											</ActionButton>
											{step !== 1 && (
												<ActionButton
													theme="Link"
													size="XSmall"
													onClick={() => {
														getPreviousStep();
													}}
												>
													{'< '}
													Retour
												</ActionButton>
											)}
										</ActionButtons>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</OnboardingStep>
		);
	}
}

export default OnboardingFifthStep;
