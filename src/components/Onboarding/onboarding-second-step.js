import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {Component} from 'react';
import {Mutation} from 'react-apollo';

import fbt from '../../fbt/fbt.macro';
import {
	Button,
	FlexColumn,
	FlexRow,
	gray50,
	gray70,
	gray80,
	H4,
	P,
	primaryBlue,
	primaryWhite,
} from '../../utils/content';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
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
	color: ${gray50};
	font-size: 15px;
`;

const DomainCards = styled(FlexRow)`
	flex-wrap: wrap;
`;

const DomainCard = styled('div')`
	width: 100%;
	margin-bottom: 15px;
	padding: 14px 16px 15px 16px;
	color: ${props => (props.selected ? primaryWhite : gray80)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;
`;

class OnboardingSecondStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			painsExpressed: props.me.painsExpressed || [],
		};
	}

	toggleSelectedItems = (painsExpressed, item, setFieldValue) => {
		const itemIndex = painsExpressed.findIndex(e => e === item);

		if (itemIndex !== -1) {
			painsExpressed.splice(itemIndex, 1);
			setFieldValue('painsExpressed', painsExpressed);

			return;
		}
		setFieldValue('painsExpressed', painsExpressed);
		painsExpressed.push(item);
		this.setState({painsExpressed});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, isFirstStep,
		} = this.props;
		const pains = [
			<fbt project="inyo" desc="onboarding second step worries juggle">
				Jongler entre plusieurs canaux de communications (Slack, emails,
				etc.)
			</fbt>,
			<fbt project="inyo" desc="onboarding second step worries estimate">
				Estimer correctement le temps et les tâches en amont du projet
			</fbt>,
			<fbt project="inyo" desc="onboarding second step worries organise">
				Organiser et respecter mon programme de temps de travail
			</fbt>,
			<fbt project="inyo" desc="onboarding second step worries customer">
				Relancer mes clients pour obtenir des validations
			</fbt>,
		];

		return (
			<OnboardingStep>
				<StepSubtitle>
					<fbt project="inyo" desc="onboarding second step title">
						Qu'est-ce qui vous ennuie le plus au quotidien ?
					</fbt>
				</StepSubtitle>
				<StepDescription>
					<fbt
						project="inyo"
						desc="onboarding second step description"
					>
						Vous pouvez choisir plusieurs options
					</fbt>
				</StepDescription>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								painsExpressed: me.painsExpressed || [],
								other: '',
							}}
							validate={({painsExpressed, other}) => {
								const errors = {};

								if (
									painsExpressed.find(
										e => e
											=== (
												<fbt
													project="inyo"
													desc="other"
												>
													Autre
												</fbt>
											),
									)
									&& !other
								) {
									errors.other = (
										<fbt project="inyo" desc="required">
											Requis
										</fbt>
									);
								}

								return errors;
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								window.Intercom('update', {
									painsExpressed: values.painsExpressed,
									otherPain: values.otherPain,
								});
								const newPainsExpressed = values.painsExpressed;

								try {
									await updateUser({
										variables: {
											painsExpressed: newPainsExpressed,
											otherPain: values.other,
										},
									});

									getNextStep();
								}
								catch (error) {
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg: (
											<fbt
												project="inyo"
												desc="something went wrong"
											>
												Quelque chose s'est mal passé
											</fbt>
										),
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
										<DomainCards>
											{pains.map(pain => (
												<DomainCard
													selected={values.painsExpressed.find(
														e => e === pain,
													)}
													onClick={() => {
														this.toggleSelectedItems(
															values.painsExpressed,
															pain,
															setFieldValue,
														);
													}}
												>
													{pain}
												</DomainCard>
											))}
											<DomainCard
												selected={values.painsExpressed.find(
													e => e
														=== (
															<fbt
																project="inyo"
																desc="other"
															>
																Autre
															</fbt>
														),
												)}
												onClick={() => {
													this.toggleSelectedItems(
														values.painsExpressed,
														<fbt
															project="inyo"
															desc="other"
														>
															Autre
														</fbt>,
														setFieldValue,
													);
												}}
											>
												<fbt
													project="inyo"
													desc="other"
												>
													Autre
												</fbt>
											</DomainCard>
											{values.painsExpressed.find(
												e => e
													=== (
														<fbt
															project="inyo"
															desc="other"
														>
															Autre
														</fbt>
													),
											) && (
												<FormElem
													label={
														<fbt
															project="inyo"
															desc="onboarding second step more information"
														>
															Donnez nous un
															exemple :)
														</fbt>
													}
													errors={errors}
													required
													values={values}
													type="text"
													touched={touched}
													name="other"
													id="other"
													handleBlur={handleBlur}
													handleChange={handleChange}
												/>
											)}
										</DomainCards>
										<ActionButtons>
											<ActionButton
												theme="Primary"
												size="Medium"
												type="submit"
											>
												<fbt
													project="inyo"
													desc="onboarding second step confirm"
												>
													Continuer
												</fbt>
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
													<fbt
														project="inyo"
														desc="back"
													>
														Retour
													</fbt>
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

export default OnboardingSecondStep;
