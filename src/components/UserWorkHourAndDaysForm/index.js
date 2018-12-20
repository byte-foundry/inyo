import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';

import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {
	Button,
	FlexColumn,
	primaryWhite,
	gray20,
	ErrorInput,
	Label,
} from '../../utils/content';
import {GET_USER_INFOS} from '../../utils/queries';

import DoubleRangeTimeInput from '../DoubleRangeTimeInput';
import WeekDaysInput from '../WeekDaysInput';

const UserWorkHourAndDaysFormMain = styled('div')``;

const FormContainer = styled('div')``;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 20px 40px;
	border: 1px solid ${gray20};
`;
const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;
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

class UserWorkHourAndDaysForm extends Component {
	render() {
		const {startWorkAt, endWorkAt} = this.props.data;

		const startHourInitial = startWorkAt
			? Number.parseInt(startWorkAt.substring(0, 2), 10)
			: 8;
		const startMinutesInitial = startWorkAt
			? Number.parseInt(startWorkAt.substring(3, 5), 10)
			: 30;
		const endHourInitial = endWorkAt
			? Number.parseInt(endWorkAt.substring(0, 2), 10)
			: 19;
		const endMinutesInitial = endWorkAt
			? Number.parseInt(endWorkAt.substring(3, 5), 10)
			: 0;
		const workingDaysInitial = this.props.data.workingDays || [
			'MONDAY',
			'TUESDAY',
			'WEDNESDAY',
			'THURSDAY',
			'FRIDAY',
		];

		return (
			<UserWorkHourAndDaysFormMain>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								startMinutes: startMinutesInitial,
								startHour: startHourInitial,
								endHour: endHourInitial,
								endMinutes: endMinutesInitial,
								workingDays: workingDaysInitial,
							}}
							validationSchema={Yup.object().shape({})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);

								const {
									startHour,
									startMinutes,
									endHour,
									endMinutes,
									workingDays,
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
											startWorkAt: start
												.toJSON()
												.split('T')[1],
											endWorkAt: end
												.toJSON()
												.split('T')[1],
											workingDays,
										},
										update: (
											cache,
											{data: {updateUser: updatedUser}},
										) => {
											window.$crisp.push([
												'set',
												'session:event',
												[
													[
														[
															'updated_user_data',
															{},
															'green',
														],
													],
												],
											]);
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = updatedUser;
											try {
												cache.writeQuery({
													query: GET_USER_INFOS,
													data,
												});
												ReactGA.event({
													category: 'User',
													action: 'Updated user data',
												});
												this.props.done();
											}
											catch (e) {
												throw e;
											}
										},
									});
								}
								catch (error) {
									Sentry.captureException(error);
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
									status,
									handleSubmit,
									values: {
										startHour,
										startMinutes,
										endHour,
										endMinutes,
										workingDays,
									},
									setFieldValue,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<ProfileSection>
											<FormContainer>
												<FlexColumn justifyContent="space-between">
													<Label>
														Horaires de travail
													</Label>
													<DoubleRangeTimeInput
														value={{
															start: [
																startHour,
																startMinutes,
															],
															end: [
																endHour,
																endMinutes,
															],
														}}
														setFieldValue={
															setFieldValue
														}
													/>
													<EmojiTimeline>
														<Emoji offset={0}>
															🌙
														</Emoji>
														<Emoji offset={33}>
															🥐
														</Emoji>
														<Emoji offset={50}>
															🍱
														</Emoji>
														<Emoji offset={87}>
															🛌
														</Emoji>
														<Emoji offset={100}>
															🌗
														</Emoji>
													</EmojiTimeline>
													<Label>
														Jours travaillés
													</Label>
													<WeekDaysInput
														values={workingDays}
														setFieldValue={
															setFieldValue
														}
													/>
												</FlexColumn>
											</FormContainer>
											{status
												&& status.msg && (
												<ErrorInput>
													{status.msg}
												</ErrorInput>
											)}
										</ProfileSection>
										<UpdateButton
											theme="Primary"
											size="Medium"
											type="submit"
										>
											Mettre à jour
										</UpdateButton>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</UserWorkHourAndDaysFormMain>
		);
	}
}

export default UserWorkHourAndDaysForm;
