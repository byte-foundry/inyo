import React, {Component} from 'react';
import styled from 'react-emotion';
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

const UseCaseCards = styled(FlexRow)`
	flex-wrap: wrap;
`;

const UseCaseCard = styled('div')`
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

const useCases = ['Oui', 'Non', 'Peut être'];
const getHasUpcoming = (str) => {
	switch (str) {
	case 'Oui':
		return true;
	case 'Non':
		return false;
	default:
		return null;
	}
};
const getUseCase = (bln) => {
	switch (bln) {
	case true:
		return 'Oui';
	case false:
		return 'Non';
	default:
		return 'Peut être';
	}
};

class OnboardingFifthStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasUpcomingProject: getUseCase(props.me.hasUpcomingProject),
		};
	}

	selectItem = (item, setFieldValue) => {
		setFieldValue('hasUpcomingProject', item);
		this.setState({hasUpcomingProject: item});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const {hasUpcomingProject} = this.state;

		return (
			<OnboardingStep>
				<StepSubtitle>Dernière question !</StepSubtitle>
				<StepSubtitle>
					Avez-vous un projet permettant d'utiliser Inyo dans la
					semaine à venir ?
				</StepSubtitle>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								hasUpcomingProject: me.hasUpcomingProject,
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								const newHasUpcomingProject
									= values.hasUpcomingProject;

								try {
									updateUser({
										variables: {
											hasUpcomingProject: getHasUpcoming(
												newHasUpcomingProject,
											),
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
								const {setFieldValue, handleSubmit} = props;

								return (
									<form onSubmit={handleSubmit}>
										<UseCaseCards>
											{useCases.map(useCase => (
												<UseCaseCard
													selected={
														hasUpcomingProject
														=== useCase
													}
													onClick={() => {
														this.selectItem(
															useCase,
															setFieldValue,
														);
													}}
												>
													{useCase}
												</UseCaseCard>
											))}
										</UseCaseCards>
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
