import React, {Component} from 'react';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import FormElem from '../FormElem';

import {
	H4,
	FlexRow,
	gray70,
	primaryWhite,
	primaryBlue,
	gray30,
	FlexColumn,
	Button,
	Label,
} from '../../utils/content';

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

const VATCards = styled(FlexRow)`
	flex-wrap: wrap;
`;

const VATCard = styled('div')`
	width: 39.771%;
	margin-right: 2.5%;
	margin-left: 2.5%;
	margin-bottom: 15px;
	padding: 14px 16px 15px 16px;
	color: ${props => (props.selected ? primaryWhite : gray30)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;
`;

class OnboardingThirdStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItem: '',
			isVATApplicable: true,
		};
	}

	selectItem = (setFieldValue) => {
		const {isVATApplicable} = this.state;

		setFieldValue('isVATApplicable', !isVATApplicable);
		this.setState({isVATApplicable: !isVATApplicable});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const {isVATApplicable} = this.state;

		return (
			<OnboardingStep>
				<StepSubtitle>
					Nous avons besoin de quelques informations pour nous aider à
					travailler pour vous.
				</StepSubtitle>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								defaultDailyPrice: me.defaultDailyPrice || 350,
								isTVAApplicable: true,
							}}
							validationSchema={Yup.object().shape({
								defaultDailyPrice: Yup.number(
									'Doit être un nombre',
								).required('Requis'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								try {
									updateUser({
										variables: {
											defaultVatRate: values.isTVAApplicable
												? 20
												: 0,
											defaultDailyPrice:
												values.defaultDailyPrice,
										},
										update: (
											cache,
											{data: {updateUser: updatedUser}},
										) => {
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = updatedUser;
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
								const {handleSubmit, setFieldValue} = props;

								return (
									<form onSubmit={handleSubmit}>
										<FormElem
											{...props}
											name="defaultDailyPrice"
											type="number"
											label="Quel est votre taux journée ?"
											placeholder="350"
											onboarding
											required
										/>
										<Label onboarding>
											Êtes-vous assujetti à la TVA?
										</Label>
										<VATCards>
											<VATCard
												selected={
													isVATApplicable === true
												}
												onClick={() => {
													this.selectItem(
														setFieldValue,
													);
												}}
											>
												Oui
											</VATCard>
											<VATCard
												selected={
													isVATApplicable === false
												}
												onClick={() => {
													this.selectItem(
														setFieldValue,
													);
												}}
											>
												Non
											</VATCard>
										</VATCards>
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

export default OnboardingThirdStep;
