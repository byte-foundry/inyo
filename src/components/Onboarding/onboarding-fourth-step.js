import React, {Component} from 'react';
import styled from 'react-emotion';
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
	color: ${props => (props.selected ? primaryWhite : gray30)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;
`;

class OnboardingFourthStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interestedFeatures: props.me.interestedFeatures,
		};
	}

	toggleSelectedItems = (item, setFieldValue) => {
		const {interestedFeatures} = this.state;
		const itemIndex = interestedFeatures.findIndex(e => e === item);

		if (itemIndex !== -1) {
			interestedFeatures.splice(itemIndex, 1);
			setFieldValue('interestedFeatures', interestedFeatures);
			this.setState({interestedFeatures});

			return;
		}
		setFieldValue('interestedFeatures', interestedFeatures);
		interestedFeatures.push(item);
		this.setState({interestedFeatures});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const {interestedFeatures} = this.state;
		const features = [
			'Gérer mes projets',
			'Créer des avenants facilement',
			'Discuter avec mon client',
			'Gérer mes factures',
			'Tracker mon temps passé',
			'Être accompagné sur la création de mes documents',
		];

		return (
			<OnboardingStep>
				<StepSubtitle>
					Quelles fonctionnalités vous intéressent ?
				</StepSubtitle>
				<StepDescription>
					Vous pouvez choisir plusieurs options
				</StepDescription>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								interestedFeatures: me.interestedFeatures,
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								const {interestedFeatures} = values;

								try {
									updateUser({
										variables: {
											interestedFeatures,
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
								const {setFieldValue, handleSubmit} = props;

								return (
									<form onSubmit={handleSubmit}>
										<DomainCards>
											{features.map(feature => (
												<DomainCard
													selected={interestedFeatures.find(
														e => e === feature,
													)}
													onClick={() => {
														this.toggleSelectedItems(
															feature,
															setFieldValue,
														);
													}}
												>
													{feature}
												</DomainCard>
											))}
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

export default OnboardingFourthStep;
