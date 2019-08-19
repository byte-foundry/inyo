import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {useMutation} from 'react-apollo-hooks';

import {
	Button,
	FlexColumn,
	FlexRow,
	gray70,
	gray80,
	H4,
	P,
	primaryBlue,
	primaryWhite,
} from '../../utils/content';
import welcomeIllus from '../../utils/images/bermuda-welcome.svg';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import FormElem from '../FormElem';

const OnboardingStep = styled('div')`
	width: 100%;
	display: flex;
	flex-direction: column;
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

const Illus = styled('img')`
	height: 250px;
`;

const OnboardingThirdStep = ({
	me,
	getNextStep,
	getPreviousStep,
	isFirstStep,
}) => {
	const [updateUser] = useMutation(UPDATE_USER_CONSTANTS);

	return (
		<OnboardingStep>
			<StepSubtitle>Dernière question !</StepSubtitle>
			<Illus src={welcomeIllus} />
			<StepDescription>
				Auriez-vous quelques minutes pour nous aider à transformer Inyo
				en l'application de vos rêves?
			</StepDescription>
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
				onSubmit={(values, actions) => {
					actions.setSubmitting(false);

					window.Intercom('update', {
						canBeContacted: values.canBeContacted,
						phone: values.phone,
					});

					try {
						updateUser({
							variables: {
								canBeContacted: values.canBeContacted,
								company: {
									phone: values.phone,
								},
							},
						});

						getNextStep();
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
									onClick={() => setFieldValue('canBeContacted', true)
									}
								>
									Oui
								</UseCaseCard>
								<UseCaseCard
									selected={!values.canBeContacted}
									onClick={() => setFieldValue('canBeContacted', false)
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
								{!isFirstStep && (
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
		</OnboardingStep>
	);
};

export default OnboardingThirdStep;
