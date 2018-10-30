import React, {Component} from 'react';
import styled from 'react-emotion';
import {Formik} from 'formik';
import {Mutation} from 'react-apollo';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';

import {
	H3,
	H4,
	P,
	gray50,
	FlexRow,
	gray70,
	primaryWhite,
	primaryBlue,
	gray30,
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
	color: ${props => (props.selected ? primaryWhite : gray30)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;
`;

class OnboardingFifthStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItem: '',
		};
	}

	selectItem = (item, setFieldValue) => {
		const {selectedItem} = this.state;

		setFieldValue('selectedItem', item);
		this.setState({selectedItem: item});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const {selectedItem} = this.state;
		const useCases = ['Oui', 'Non', 'Peut être'];

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
								selectedItem: '',
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								try {
									// updateUser({
									// 	variables: {}
									// });
									getNextStep();
								}
								catch (error) {
									console.log(error);
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
														selectedItem === useCase
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
