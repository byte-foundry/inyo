import React, {Component} from 'react';
import styled from 'react-emotion';
import {Formik} from 'formik';
import {Mutation} from 'react-apollo';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import FormElem from '../FormElem';

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

const StepTitle = styled(H3)`
	text-align: center;
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

class OnboardingFirstStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItems: props.me.workingFields,
		};
	}

	toggleSelectedItems = (item, setFieldValue) => {
		const {selectedItems} = this.state;
		const itemIndex = selectedItems.findIndex(e => e === item);

		if (itemIndex !== -1) {
			selectedItems.splice(itemIndex, 1);
			setFieldValue('workingFields', selectedItems);
			this.setState({selectedItems});

			return;
		}
		setFieldValue('workingFields', selectedItems);
		selectedItems.push(item);
		this.setState({selectedItems});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const {selectedItems} = this.state;
		const domains = [
			'Design',
			'Développement',
			'Écriture',
			'Photographie',
			'Multimédia',
			'Marketing',
			'Comptabilité',
			'Autre',
		];

		return (
			<OnboardingStep>
				<StepTitle>Bienvenue, {me.firstName} !</StepTitle>
				<StepSubtitle>Dans quel domaine travaillez-vous ?</StepSubtitle>
				<StepDescription>
					Vous pouvez choisir plusieurs options
				</StepDescription>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								workingFields: me.workingFields,
								otherDomain: '',
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								const {workingFields, otherDomain} = values;

								try {
									if (otherDomain !== '') {
										workingFields.push(otherDomain);
									}
									updateUser({
										variables: {
											workingFields,
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
											{domains.map(domain => (
												<DomainCard
													selected={selectedItems.find(
														e => e === domain,
													)}
													onClick={() => {
														this.toggleSelectedItems(
															domain,
															setFieldValue,
														);
													}}
												>
													{domain}
												</DomainCard>
											))}
										</DomainCards>
										{selectedItems.find(
											e => e === 'Autre',
										) && (
											<FormElem
												{...props}
												name="otherDomain"
												type="text"
												label="Autre ? Merci de spécifier"
												placeholder="Journaliste"
												onboarding="true"
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

export default OnboardingFirstStep;
