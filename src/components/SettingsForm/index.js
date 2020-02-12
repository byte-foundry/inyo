import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import {Formik} from 'formik';
import React from 'react';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {
	ErrorInput, gray20, Label, primaryWhite,
} from '../../utils/content';
import workingIllus from '../../utils/images/bermuda-uploading.svg';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {A, Button} from '../../utils/new/design-system';
import {findTimeZone, getUTCOffset, timezones} from '../../utils/timezones';
import DoubleRangeTimeInput from '../DoubleRangeTimeInput';
import FormCheckbox from '../FormCheckbox';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';
import Tooltip from '../Tooltip';
import WeekDaysInput from '../WeekDaysInput';

const SettingsFormMain = styled('div')``;

const FormContainer = styled('div')`
	flex: 1;
	display: grid;
	grid-template-columns: 1fr 2fr;
	align-items: center;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
	grid-row: 4 / 12;
`;

const SettingsForm = ({data: props, done = () => {}}) => {
	const {
		timeZone: initialTimeZone,
		startWorkAt,
		endWorkAt,
		settings: {hasFullWeekSchedule: hasFullWeekScheduleInitial},
		workingDays,
		defaultDailyPrice: initialDailyRate,
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
		<SettingsFormMain>
			<Formik
				initialValues={{
					startHour: startHourInitial,
					startMinutes: startMinutesInitial,
					endHour: endHourInitial,
					endMinutes: endMinutesInitial,
					breakStartHour: 15,
					breakStartMinutes: 0,
					breakEndHour: 18,
					breakEndMinutes: 30,
					workingDays: workingDaysInitial,
					hasNotFullWeekSchedule: !hasFullWeekScheduleInitial,
					timeZone: initialTimeZone,
					dailyRate: initialDailyRate,
				}}
				validationSchema={Yup.object().shape({
					dailyRate: Yup.number()
						.typeError(
							fbt(
								'Le prix doit être un nombre',
								'daily rate input not number',
							),
						)
						.positive(
							fbt(
								'Le prix doit être un nombre positif',
								'daily rate input not positive',
							),
						)
						.nullable(),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);

					const {
						startHour,
						startMinutes,
						endHour,
						endMinutes,
						breakStartHour,
						breakStartMinutes,
						breakEndHour,
						breakEndMinutes,
						workingDays,
						timeZone,
						hasNotFullWeekSchedule,
						dailyRate,
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
								defaultDailyPrice: dailyRate
									? parseInt(dailyRate, 10)
									: null,
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
							msg: (
								<fbt project="inyo" desc="something went wrong">
									Quelque chose s'est mal passé
								</fbt>
							),
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
							breakStartHour,
							breakStartMinutes,
							breakEndHour,
							breakEndMinutes,
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
										<fbt
											project="inyo"
											desc="notification message"
										>
											Horaires de travail
										</fbt>
									</Label>
									<DoubleRangeTimeInput
										style={{
											gridColumn: '1 / 3',
										}}
										value={{
											start: [startHour, startMinutes],
											end: [endHour, endMinutes],
											breakStart: [
												breakStartHour,
												breakStartMinutes,
											],
											breakEnd: [
												breakEndHour,
												breakEndMinutes,
											],
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
											aria-label={
												<fbt
													project="inyo"
													desc="morning"
												>
													matin
												</fbt>
											}
											offset={0}
											children="🌙"
										/>
										<Emoji
											role="img"
											aria-label={
												<fbt
													project="inyo"
													desc="breakfast"
												>
													petit déjeuner
												</fbt>
											}
											offset={33}
											children="☕"
										/>
										<Emoji
											role="img"
											aria-label={
												<fbt
													project="inyo"
													desc="lunch"
												>
													déjeuner
												</fbt>
											}
											offset={50}
											children="🍽️"
										/>
										<Emoji
											role="img"
											aria-label={
												<fbt
													project="inyo"
													desc="evening"
												>
													soirée
												</fbt>
											}
											offset={87}
											children="🛌"
										/>
										<Emoji
											role="img"
											aria-label={
												<fbt
													project="inyo"
													desc="night"
												>
													nuit
												</fbt>
											}
											offset={100}
											children="🌗"
										/>
									</EmojiTimeline>
									<Label>
										<fbt project="inyo" desc="working days">
											Jours travaillés
										</fbt>
									</Label>
									<WeekDaysInput
										values={workingDays}
										setFieldValue={setFieldValue}
									/>
									<FormCheckbox
										{...props}
										name="hasNotFullWeekSchedule"
										type="checkbox"
										label={
											<fbt
												project="inyo"
												desc="display only worked days"
											>
												Afficher seulement les jours
												travaillés dans le calendrier
											</fbt>
										}
									/>
									<Label>
										<fbt project="inyo" desc="timezone">
											Fuseau horaire
										</fbt>
									</Label>
									<FormSelect
										{...props}
										style={{marginBottom: '1rem'}}
										name="timeZone"
										placeholder={
											<fbt
												project="inyo"
												desc="sort by timezone"
											>
												Triez par fuseau
											</fbt>
										}
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
									<Tooltip
										label={fbt(
											'Prix que vous facturé en moyenne par journée',
											'daily rate',
										)}
									>
										<Label>
											<fbt project="inyo" desc="timezone">
												Prix journalier moyen
											</fbt>
										</Label>
									</Tooltip>
									<FormElem
										{...props}
										name="dailyRate"
										placeholder={fbt('300€', 'price')}
										padded
										required
									/>
									<div>
										<A
											href={fbt(
												'https://inyo.me/calculer-son-tjm/',
												'link to daily rate calculator',
											)}
										>
											<fbt
												project="inyo"
												desc="label link to daily rate calculator"
											>
												Calculer mon prix journalier
											</fbt>
										</A>
										{status && status.msg && (
											<ErrorInput
												style={{
													marginBottom: '1rem',
												}}
											>
												{status.msg}
											</ErrorInput>
										)}
									</div>
								</FormContainer>
							</ProfileSection>
							<UpdateButton type="submit" big>
								<fbt project="inyo" desc="update">
									Mettre à jour
								</fbt>
							</UpdateButton>
						</form>
					);
				}}
			</Formik>
		</SettingsFormMain>
	);
};

export default SettingsForm;
