import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring';
import styled from '@emotion/styled/macro';
import moment from 'moment';

import {BREAKPOINTS, REMINDER_TYPES_DATA} from '../../utils/constants';
import {
	primaryGrey,
	primaryWhite,
	primaryRed,
	primaryBlack,
	Button,
	Select,
	BackButton,
} from '../../utils/new/design-system';
import usePrevious from '../../utils/usePrevious';
import useMeasure from '../../utils/useMeasure';
import ReminderTestEmailButton from '../ReminderTestEmailButton';
import {ReactComponent as PencilIcon} from '../../utils/icons/pencil.svg';

const Container = styled('div')`
	display: flex;
	flex-direction: column;
`;

const EditIcon = styled(PencilIcon)`
	width: 18px;
	height: 18px;
	vertical-align: middle;

	path {
		fill: ${primaryGrey};
	}
`;

const ReminderList = styled('div')`
	margin-bottom: 2rem;
	margin-top: 1rem;
`;

const Delete = styled(Button)`
	color: ${primaryRed};
	width: 1.2rem;
	height: 1.2rem;
	transition: all 200ms ease;

	&:hover {
		color: ${primaryWhite};
		background-color: ${primaryRed};
	}
`;

const ReminderItem = styled('div')`
	color: ${primaryBlack};
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 5px;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		display: flow-root;
		align-items: flex-start;
	}
`;

const ReminderText = styled('div')`
	flex: 1 0 200px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;

	@media (max-width: ${BREAKPOINTS}px) {
		flex: 1;
	}
`;

const ReminderDate = styled('div')`
	font-size: 12px;
	margin: 0 5px;
	cursor: default;

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 0;
	}
`;

const ReminderActions = styled('div')`
	display: flex;
	text-align: right;
	justify-content: space-between;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		align-items: flex-start;
		margin: 10px 0;
	}
`;

const ReminderButtons = styled('div')`
	margin-left: 1rem;
	display: flex;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 10px 0;
	}
`;

const ButtonIcon = styled(Button)`
	svg {
		width: 14px;
		max-height: 14px;
	}
`;

const ReminderForm = styled(animated.form)`
	display: flex;
	flex-direction: column;
`;

const ReminderFormGroup = styled('div')`
	display: flex;
	margin: 1rem 0 0.5rem 0;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const ReminderFormActions = styled('div')`
	display: flex;
	align-self: flex-end;
	margin: 0 0 1.5rem 0;
`;

const WrapProps = styled(animated.div)`
	display: flex;
	flex-direction: column;
`;

const CollapsableReminderForm = ({children, isOpen, ...props}) => {
	const [bind, {height: viewHeight}] = useMeasure();
	const wasOpen = usePrevious(isOpen);
	const animatedProps = useSpring({
		to: async (next) => {
			if (isOpen) {
				await next({
					opacity: 1,
					height: viewHeight,
					overflow: 'hidden',
				});
				await next({opacity: 1, height: 'auto', overflow: ''});
			}
			else {
				if (wasOpen) {
					await next({
						opacity: 1,
						height: viewHeight,
						overflow: 'hidden',
					});
				}
				await next({opacity: 0, height: 0, overflow: 'hidden'});
			}
		},
		from: {opacity: 0, height: 0, overflow: 'hidden'},
		config: {
			mass: 1, tension: 350, friction: 22, clamp: true,
		},
	});

	return (
		<ReminderForm style={animatedProps} {...props}>
			<WrapProps {...bind}>{children}</WrapProps>
		</ReminderForm>
	);
};

const TaskRemindersPreviewsList = ({
	taskId,
	remindersPreviews: plannedReminders = [],
	customerName = '',
	onFocusTask,
	onCancel,
}) => {
	const [reminders, setReminders] = useState(plannedReminders);
	const [editingIndex, setEditingIndex] = useState(null);
	const [value, setValue] = useState(1);
	const [unit, setUnit] = useState('days');
	const [isRelative, setIsRelative] = useState(true);

	const durationOptions = {
		minutes: new Array(60 / 5 - 1).fill(0).map((_, i) => ({
			label: (i + 1) * 5,
			value: (i + 1) * 5,
		})),
		hours: new Array(24 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1,
		})),
		days: new Array(7 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1,
		})),
		weeks: new Array(12 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1,
		})),
	};

	useEffect(() => {
		setValue(1);
		setUnit('days');
		setIsRelative(true);
	}, [editingIndex]);

	return (
		<Container>
			<BackButton grey type="button" link onClick={() => onCancel()}>
				Retour
			</BackButton>
			<ReminderList>
				{reminders
					.sort((a, b) => a.delay - b.delay)
					.map((reminder, index) => {
						const text = REMINDER_TYPES_DATA[reminder.type].text(
							customerName,
						);

						const dataTipProps = {};

						let delay;

						if (index === 0 || !reminder.isRelative) {
							delay = `${moment
								.duration(reminder.delay * 1000)
								.humanize()} après l'activation de la tâche`;
						}
						else {
							delay = `${moment
								.duration(
									(reminder.delay
										- reminders[index - 1].delay)
										* 1000,
								)
								.humanize()} après l'email précédent`;
						}

						return (
							<>
								<ReminderItem>
									<ReminderText
										canceled={false}
										done={false}
										{...dataTipProps}
									>
										{text}
									</ReminderText>
									<ReminderActions>
										<ReminderDate>{delay}</ReminderDate>
										<ReminderButtons>
											<ButtonIcon
												link
												onClick={() => {
													setEditingIndex(index);
												}}
											>
												<EditIcon />
											</ButtonIcon>
											<ReminderTestEmailButton
												taskId={taskId}
												reminder={reminder}
												preview
											/>
											<Delete
												data-tip="Supprimer cette action automatique"
												link
												onClick={() => {
													setReminders([
														...reminders.slice(
															0,
															index,
														),
														...reminders.slice(
															index + 1,
														),
													]);
												}}
											>
												&times;
											</Delete>
										</ReminderButtons>
									</ReminderActions>
								</ReminderItem>
								<CollapsableReminderForm
									isOpen={editingIndex === index}
									onSubmit={(e) => {
										e.preventDefault();

										const absoluteDelay = moment.duration(
											value,
											unit,
										);

										if (isRelative && index > 0) {
											absoluteDelay.add(
												reminders[index - 1].delay
													* 1000,
											);
										}

										setReminders([
											...reminders.slice(0, index),
											{
												...reminder,
												delay: absoluteDelay.asSeconds(),
												isRelative,
											},
											...reminders.slice(index + 1),
										]);

										setEditingIndex(null);
									}}
								>
									<ReminderFormGroup>
										<Select
											key={unit}
											name="value"
											options={durationOptions[unit]}
											onChange={({value}) => setValue(value)
											}
											isSearchable={false}
											defaultValue={
												durationOptions[unit][0]
											}
											style={{
												container: styles => ({
													...styles,
													flex: 1,
													margin: '5px 0 5px 5px',
												}),
											}}
										/>
										<Select
											name="unit"
											options={[
												{
													label: 'minutes',
													value: 'minutes',
												},
												{
													label: 'heures',
													value: 'hours',
												},
												{
													label: 'jours',
													value: 'days',
												},
												{
													label: 'semaines',
													value: 'weeks',
												},
											]}
											onChange={({value}) => setUnit(value)
											}
											isSearchable={false}
											defaultValue={{
												label: 'jours',
												value: 'days',
											}}
											style={{
												container: styles => ({
													...styles,
													flex: 1,
													margin: '5px 0 5px 5px',
												}),
											}}
										/>
										<Select
											name="from"
											isDisabled={index === 0}
											options={[
												{
													label:
														"après l'activation de la tâche",
													value: false,
												},
												{
													label:
														"après l'email précédent",
													value: true,
												},
											]}
											onChange={({value}) => setIsRelative(value)
											}
											isSearchable={false}
											value={
												index !== 0 && isRelative
													? {
														label:
																"après l'email précédent",
														value: true,
													  }
													: {
														label:
																"après l'activation de la tâche",
														value: false,
													  }
											}
											style={{
												container: styles => ({
													...styles,
													flex: 3,
													margin: '5px 0 5px 5px',
												}),
											}}
										/>
									</ReminderFormGroup>
									<ReminderFormActions>
										<Button
											grey
											type="button"
											link
											onClick={() => setEditingIndex(null)
											}
										>
											Annuler
										</Button>
										<Button type="submit">Valider</Button>
									</ReminderFormActions>
								</CollapsableReminderForm>
							</>
						);
					})}
			</ReminderList>
			<ReminderFormActions>
				<Button grey type="button" link onClick={() => onCancel()}>
					Annuler
				</Button>
				<Button
					type="submit"
					onClick={() => onFocusTask(
						reminders.map(r => ({
							delay: r.delay,
							type: r.type,
						})),
					)
					}
				>
					Valider l'activation
				</Button>
			</ReminderFormActions>
		</Container>
	);
};

export default TaskRemindersPreviewsList;
