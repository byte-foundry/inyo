import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import {timezones, findTimeZone, getUTCOffset} from '../../utils/timezones';

import {BREAKPOINTS} from '../../utils/constants';

import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {
	primaryWhite, gray20, ErrorInput, Label,
} from '../../utils/content';
import {Button} from '../../utils/new/design-system';
import FormSelect from '../FormSelect';
import {GET_USER_INFOS} from '../../utils/queries';

import DoubleRangeTimeInput from '../DoubleRangeTimeInput';
import WeekDaysInput from '../WeekDaysInput';
import workingIllus from '../../utils/images/bermuda-uploading.svg';

const UserWorkHourAndDaysFormMain = styled('div')``;

const FormContainer = styled('div')`
	flex: 1;
	display: grid;
	grid-template-columns: 1fr 2fr;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
`;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};

	display: flex;
	flex-direction: row;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 0;
		border: none;
	}
`;

const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-right: 0;
	}
`;

const EmojiTimeline = styled('div')`
	display: flex;
	justify-content: space-between;
	font-size: 1.8rem;
	margin: 15px;
	position: relative;
	height: 50px;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1.5rem;
	}
`;

const Emoji = styled('div')`
	position: absolute;
	left: calc(${props => props.offset}% - 21px);
	user-select: none;
`;

const Illus = styled('img')`
	margin-right: 2rem;
	align-self: end;
	grid-row: 4 / 8;
`;

function UserWorkHourAndDaysForm({data, done = () => {}}) {
	const {
		timeZone: initialTimeZone,
		startWorkAt,
		endWorkAt,
		workingDays,
	} = data;

	const currentDate = new Date().toJSON().split('T')[0];
	const startWorkAtDate = new Date(`${currentDate}T${startWorkAt}`);
	const endWorkAtDate = new Date(`${currentDate}T${endWorkAt}`);
	const updateUser = useMutation(UPDATE_USER_CONSTANTS);

	const startHourInitial
		= startWorkAtDate.toString() === 'Invalid Date'
			? 8
			: startWorkAtDate.getHours();
	const startMinutesInitial
		= startWorkAtDate.toString() === 'Invalid Date'
			? 30
			: startWorkAtDate.getMinutes();
	const endHourInitial
		= endWorkAtDate.toString() === 'Invalid Date'
			? 19
			: endWorkAtDate.getHours();
	const endMinutesInitial
		= endWorkAtDate.toString() === 'Invalid Date'
			? 0
			: endWorkAtDate.getMinutes();
	const workingDaysInitial = workingDays || [
		'MONDAY',
		'TUESDAY',
		'WEDNESDAY',
		'THURSDAY',
		'FRIDAY',
	];

	return (
		<UserWorkHourAndDaysFormMain>
			<Formik
				initialValues={{
					startMinutes: startMinutesInitial,
					startHour: startHourInitial,
					endHour: endHourInitial,
					endMinutes: endMinutesInitial,
					workingDays: workingDaysInitial,
					timeZone: initialTimeZone,
				}}
				validationSchema={Yup.object().shape({})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);

					const {
						startHour,
						startMinutes,
						endHour,
						endMinutes,
						...rest
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
								...rest,
								startWorkAt: start.toJSON().split('T')[1],
								endWorkAt: end.toJSON().split('T')[1],
							},
							update: (
								cache,
								{data: {updateUser: updatedUser}},
							) => {
								window.Intercom(
									'trackEvent',
									'updated-user-hours',
								);
								const data = cache.readQuery({
									query: GET_USER_INFOS,
								});

								data.me = {...data.me, ...updatedUser};
								try {
									cache.writeQuery({
										query: GET_USER_INFOS,
										data,
									});
									ReactGA.event({
										category: 'User',
										action: 'Updated user data',
									});
									done();
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
							timeZone,
						},
						setFieldValue,
					} = props;

					return (
						<form onSubmit={handleSubmit}>
							<ProfileSection>
								<FormContainer>
									<Illus src={workingIllus} />
									<Label
										style={{
											gridColumn: '1 / 3',
										}}
									>
										Horaires de travail
									</Label>
									<DoubleRangeTimeInput
										style={{
											gridColumn: '1 / 3',
										}}
										value={{
											start: [startHour, startMinutes],
											end: [endHour, endMinutes],
										}}
										setFieldValue={setFieldValue}
									/>
									<EmojiTimeline
										style={{
											gridColumn: '1 / 3',
										}}
									>
										<Emoji offset={0}>🌙</Emoji>
										<Emoji offset={33}>☕</Emoji>
										<Emoji offset={50}>🍽️</Emoji>
										<Emoji offset={87}>🛌</Emoji>
										<Emoji offset={100}>🌗</Emoji>
									</EmojiTimeline>
									<Label>Jours travaillés</Label>
									<WeekDaysInput
										values={workingDays}
										setFieldValue={setFieldValue}
									/>
									<Label>Fuseau horaire</Label>
									<FormSelect
										{...props}
										name="timeZone"
										placeholder="Triez par fuseau"
										value={{
											value: timeZone || 'Europe/Paris',
											label: `${timeZone
												|| 'Europe/Paris'} (${
												getUTCOffset(
													Date.now(),
													findTimeZone(
														timeZone
															|| 'Europe/Paris',
													),
												).abbreviation
											})`,
										}}
										options={timezones
											.sort(
												(a, b) => getUTCOffset(
													Date.now(),
													findTimeZone(a),
												).offset
														- getUTCOffset(
															Date.now(),
															findTimeZone(b),
														).offset || a - b,
											)
											.map(tz => ({
												value: tz,
												label: `${tz} (${
													getUTCOffset(
														Date.now(),
														findTimeZone(tz),
													).abbreviation
												})`,
											}))}
										hideSelectedOptions
										isSearchable
									/>
								</FormContainer>
								{status && status.msg && (
									<ErrorInput
										style={{
											marginBottom: '1rem',
										}}
									>
										{status.msg}
									</ErrorInput>
								)}
							</ProfileSection>
							<UpdateButton type="submit" big>
								Mettre à jour
							</UpdateButton>
						</form>
					);
				}}
			</Formik>
		</UserWorkHourAndDaysFormMain>
	);
}

export default UserWorkHourAndDaysForm;
