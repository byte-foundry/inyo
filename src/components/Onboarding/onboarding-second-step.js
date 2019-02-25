import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import {Mutation} from 'react-apollo';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import {
	H4,
	P,
	gray50,
	FlexRow,
	gray70,
	primaryWhite,
	primaryBlue,
	gray80,
	FlexColumn,
	Button,
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
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const pains = [
			'Jongler entre plusieurs canaux de communications (Slack, emails, etc.)',
			'Estimer correctement le temps et les tâches en amont du projet',
			'Organiser et respecter mon programme de temps de travail',
			'Relancer mes clients pour obtenir des validations',
		];

		return (
			<OnboardingStep>
				<StepSubtitle>
					Qu'est-ce qui vous ennuie le plus au quotidien ?
				</StepSubtitle>
				<StepDescription>
					Vous pouvez choisir plusieurs options
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
									painsExpressed.find(e => e === 'Autre')
									&& !other
								) {
									errors.other = 'Requis';
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
									updateUser({
										variables: {
											painsExpressed: newPainsExpressed,
											otherPain: values.other,
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
													e => e === 'Autre',
												)}
												onClick={() => {
													this.toggleSelectedItems(
														values.painsExpressed,
														'Autre',
														setFieldValue,
													);
												}}
											>
												Autre
											</DomainCard>
											{values.painsExpressed.find(
												e => e === 'Autre',
											) && (
												<FormElem
													label="Donnez nous un exemple :)"
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

export default OnboardingSecondStep;
