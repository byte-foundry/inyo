import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import {BREAKPOINTS} from '../../utils/constants';
import {
	ErrorInput, gray20, Label, primaryWhite,
} from '../../utils/content';
import workingIllus from '../../utils/images/bermuda-uploading.svg';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';
import {findTimeZone, getUTCOffset, timezones} from '../../utils/timezones';
import DoubleRangeTimeInput from '../DoubleRangeTimeInput';
import FormCheckbox from '../FormCheckbox';
import FormSelect from '../FormSelect';
import WeekDaysInput from '../WeekDaysInput';

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
		margin-bottom: 20px;
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

const Emoji = styled('span')`
	display: block;
	position: absolute;
	left: calc(${props => props.offset}% - 21px);
	user-select: none;
`;

const Illus = styled('img')`
	margin-right: 2rem;
	align-self: end;
	grid-row: 4 / 9;
`;

const UserWorkHourAndDaysForm = ({data: props, done = () => {}}) => {
	const {
		timeZone: initialTimeZone,
		startWorkAt,
		endWorkAt,
		settings: {hasFullWeekSchedule: hasFullWeekScheduleInitial},
		workingDays,
	} = props;

	const currentDate = new Date().toJSON().split('T')[0];
	const startWorkAtDate = new Date(`${currentDate}T${startWorkAt}`);
	const endWorkAtDate = new Date(`${currentDate}T${endWorkAt}`);
	const [updateUser] = useMutation(UPDATE_USER_CONSTANTS);

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
					hasNotFullWeekSchedule: !hasFullWeekScheduleInitial,
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
						workingDays,
						timeZone,
						hasNotFullWeekSchedule,
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
						await updateUser({
							variables: {
								startWorkAt: start.toJSON().split('T')[1],
								endWorkAt: end.toJSON().split('T')[1],
								workingDays,
								timeZone,
								hasFullWeekSchedule: !hasNotFullWeekSchedule,
							},
						});

						window.Intercom('trackEvent', 'updated-user-hours');

						ReactGA.event({
							category: 'User',
							action: 'Updated user data',
						});
						done();
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
										<Emoji
											role="img"
											aria-label="matin"
											offset={0}
											children="🌙"
										/>
										<Emoji
											role="img"
											aria-label="petit déjeuner"
											offset={33}
											children="☕"
										/>
										<Emoji
											role="img"
											aria-label="déjeuner"
											offset={50}
											children="🍽️"
										/>
										<Emoji
											role="img"
											aria-label="soirée"
											offset={87}
											children="🛌"
										/>
										<Emoji
											role="img"
											aria-label="nuit"
											offset={100}
											children="🌗"
										/>
									</EmojiTimeline>
									<Label>Jours travaillés</Label>
									<WeekDaysInput
										values={workingDays}
										setFieldValue={setFieldValue}
									/>
									<FormCheckbox
										{...props}
										name="hasNotFullWeekSchedule"
										type="checkbox"
										label="Afficher seulement les jours travaillés
										dans le calendrier"
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
};

export default UserWorkHourAndDaysForm;
