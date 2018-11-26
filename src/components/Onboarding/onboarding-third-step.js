import React, {Component} from 'react';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';

import {
	H4, FlexColumn, Button, Label,
} from '../../utils/content';

import DoubleRangeTimeInput from '../DoubleRangeTimeInput';

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

const EmojiTimeline = styled('div')`
	display: flex;
	justify-content: space-between;
	font-size: 32px;
	margin: 15px;
	position: relative;
	height: 50px;
`;

const Emoji = styled('div')`
	position: absolute;
	left: calc(${props => props.offset}% - 21px);
	user-select: none;
	-moz-user-select: none;
	-khtml-user-select: none;
	-webkit-user-select: none;
	-o-user-select: none;
`;

class OnboardingThirdStep extends Component {
	render() {
		const {
			me, getNextStep, getPreviousStep, step,
		} = this.props;

		const startHour = me.startWorkAt
			? Number.parseInt(me.startWorkAt.substring(0, 2), 10)
			: 8;
		const startMinutes = me.startWorkAt
			? Number.parseInt(me.startWorkAt.substring(3, 5), 10)
			: 30;
		const endHour = me.endWorkAt
			? Number.parseInt(me.endWorkAt.substring(0, 2), 10)
			: 19;
		const endMinutes = me.endWorkAt
			? Number.parseInt(me.endWorkAt.substring(3, 5), 10)
			: 0;

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
								startHour,
								startMinutes,
								endHour,
								endMinutes,
							}}
							validationSchema={Yup.object().shape({
								startHour: Yup.number().required(),
								startMinutes: Yup.number().required(),
								endHour: Yup.number().required(),
								endMinutes: Yup.number().required(),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								const {
									startHour,
									startMinutes,
									endHour,
									endMinutes,
								} = values;

								const start = new Date();

								start.setHours(startHour);
								start.setMinutes(startMinutes);
								start.setSeconds(0);
								start.setMilliseconds(0);

								const end = new Date();

								end.setHours(endHour);
								end.setMinutes(endMinutes);
								end.setSeconds(0);
								end.setMilliseconds(0);

								try {
									updateUser({
										variables: {
											workStartTime: start
												.toJSON()
												.split('T')[1],
											workEndTime: end
												.toJSON()
												.split('T')[1],
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
									handleSubmit,
									setFieldValue,
									values: {
										startHour,
										startMinutes,
										endHour,
										endMinutes,
									},
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<Label onboarding>
											Définissez vos horaires de travail
										</Label>
										<DoubleRangeTimeInput
											value={{
												start: [
													startHour,
													startMinutes,
												],
												end: [endHour, endMinutes],
											}}
											setFieldValue={setFieldValue}
										/>
										<EmojiTimeline>
											<Emoji offset={0}>🌙</Emoji>
											<Emoji offset={33}>🥐</Emoji>
											<Emoji offset={50}>🍱</Emoji>
											<Emoji offset={87}>🛌</Emoji>
											<Emoji offset={100}>🌗</Emoji>
										</EmojiTimeline>
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
