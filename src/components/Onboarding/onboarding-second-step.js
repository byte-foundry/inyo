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

const TeamTypeCards = styled(FlexRow)`
	flex-wrap: wrap;
`;

const TeamTypeCard = styled('div')`
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

const teamTypes = [
	{name: 'TEAM', value: 'Studio / Groupe de freelances'},
	{name: 'FULLTIME_INDIVIDUAL', value: 'Freelance à plein temps'},
	{name: 'PARTTIME_INDIVIDUAL', value: 'Freelance à temps partiel'},
	{name: 'NOT_FREELANCER', value: 'Je ne suis pas Freelance'},
];

class OnboardingSecondStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobType: props.me.jobType,
		};
	}

	selectItem = (item, setFieldValue) => {
		setFieldValue('jobType', item);
		this.setState({jobType: item});
	};

	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;
		const {jobType} = this.state;

		return (
			<OnboardingStep>
				<StepSubtitle>
					Quelle type de structure avez-vous ?
				</StepSubtitle>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								jobType: me.jobType,
							}}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								const newJobType = values.jobType;

								try {
									updateUser({
										variables: {
											jobType: newJobType,
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
										<TeamTypeCards>
											{teamTypes.map(teamType => (
												<TeamTypeCard
													selected={
														jobType
														=== teamType.name
													}
													onClick={() => {
														this.selectItem(
															teamType.name,
															setFieldValue,
														);
													}}
												>
													{teamType.value}
												</TeamTypeCard>
											))}
										</TeamTypeCards>
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
