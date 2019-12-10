import styled from "@emotion/styled/macro";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";

import fbt from "../../fbt/fbt.macro";
import { BREAKPOINTS, REMINDER_TYPES_DATA } from "../../utils/constants";
import {
	BackButton,
	Button,
	DateContainer,
	primaryBlack,
	Select
} from "../../utils/new/design-system";
import useMeasure from "../../utils/useMeasure";
import useOnClickOutside from "../../utils/useOnClickOutside";
import usePrevious from "../../utils/usePrevious";
import DateInput from "../DateInput";
import IconButton from "../IconButton";
import ReminderTestEmailButton from "../ReminderTestEmailButton";
import Tooltip from "../Tooltip";
import TimingInput from "../TimingInput";

const Container = styled("div")`
	display: flex;
	flex-direction: column;
`;

const ReminderList = styled("div")`
	margin-bottom: 2rem;
	margin-top: 1rem;
`;

const ReminderItem = styled("div")`
	color: ${primaryBlack};
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 5px;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
		display: flow-root;
		align-items: flex-start;
	}
`;

const ReminderText = styled("div")`
	flex: 1 0 200px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex: 1;
	}
`;

const ReminderDate = styled("div")`
	font-size: 12px;
	margin: 0 5px;
	cursor: default;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin: 0;
	}
`;

const ReminderActions = styled("div")`
	display: flex;
	text-align: right;
	justify-content: space-between;
	align-items: center;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
		align-items: flex-start;
		margin: 10px 0;
	}
`;

const ReminderButtons = styled("div")`
	margin-left: 1rem;
	display: flex;
	align-items: center;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin: 10px 0;
	}
`;

const ReminderForm = styled(animated.form)`
	display: flex;
	flex-direction: column;
`;

const ReminderFormGroup = styled("div")`
	display: flex;
	align-items: center;
	margin: 1rem 0 0.5rem 0;
	font-size: 0.8rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
	}
`;

const ReminderFormActions = styled("div")`
	display: flex;
	align-self: flex-end;
	margin: 0 0 1.5rem 0;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column-reverse;
		width: 100%;

		${Button} {
			margin: 0 0 1rem 0;
		}
	}
`;

const WrapProps = styled(animated.div)`
	display: flex;
	flex-direction: column;
`;

const CollapsableReminderForm = ({ children, isOpen, ...props }) => {
	const [bind, { height: viewHeight }] = useMeasure();
	const wasOpen = usePrevious(isOpen);
	const animatedProps = useSpring({
		to: async next => {
			if (isOpen) {
				await next({
					opacity: 1,
					height: viewHeight,
					overflow: "hidden"
				});
				await next({ opacity: 1, height: "auto", overflow: "" });
			} else {
				if (wasOpen) {
					await next({
						opacity: 1,
						height: viewHeight,
						overflow: "hidden"
					});
				}
				await next({ opacity: 0, height: 0, overflow: "hidden" });
			}
		},
		from: { opacity: 0, height: 0, overflow: "hidden" },
		config: {
			mass: 1,
			tension: 350,
			friction: 22,
			clamp: true
		}
	});

	return (
		<ReminderForm style={animatedProps} {...props}>
			<WrapProps {...bind}>{children}</WrapProps>
		</ReminderForm>
	);
};

const convertDelayToValues = ({ delay, isRelative }) => {
	let value;
	let unit;

	if (delay <= 55 * 60) {
		value = delay / 60;
		unit = "minutes";
	} else if (delay <= 23 * 60 * 60) {
		value = delay / (60 * 60);
		unit = "hours";
	} else if (delay <= 6 * 60 * 60 * 24) {
		value = delay / (60 * 60 * 24);
		unit = "days";
	} else {
		value = delay / (60 * 60 * 24 * 7);
		unit = "weeks";
	}

	return {
		value,
		unit,
		isRelative
	};
};

const TaskRemindersPreviewsList = ({
	taskId,
	remindersPreviews: plannedReminders = [],
	customerName = "",
	initialScheduledFor,
	onFocusTask,
	onCancel
}) => {
	const [reminders, setReminders] = useState(plannedReminders);
	const [editingIndex, setEditingIndex] = useState(null);
	const [value, setValue] = useState(1);
	const [unit, setUnit] = useState("days");
	const [isRelative, setIsRelative] = useState(true);
	const [isEditingScheduledFor, setIsEditingScheduledFor] = useState(false);
	const [scheduledFor, setScheduledFor] = useState(
		moment(initialScheduledFor)
	);

	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setIsEditingScheduledFor(false);
	});

	const durationOptions = {
		minutes: new Array(60 / 5 - 1).fill(0).map((_, i) => ({
			label: (i + 1) * 5,
			value: (i + 1) * 5
		})),
		hours: new Array(24 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1
		})),
		days: new Array(7 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1
		})),
		weeks: new Array(12 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1
		}))
	};

	const mutableReminders = [...reminders];

	useEffect(() => {
		if (editingIndex !== null) {
			const reminder = mutableReminders[editingIndex];
			const { value, unit, isRelative } = convertDelayToValues(reminder);
			setValue(value);
			setUnit(unit);
			setIsRelative(isRelative);
		} else {
			setValue(1);
			setUnit("days");
			setIsRelative(false);
		}
	}, [editingIndex]);

	return (
		<Container>
			<BackButton grey type="button" link onClick={() => onCancel()}>
				<fbt project="inyo" desc="Back">
					Retour
				</fbt>
			</BackButton>
			<DateContainer style={{ alignSelf: "flex-start" }}>
				<span onClick={() => setIsEditingScheduledFor(true)}>
					<fbt project="inyo" desc="activation date">
						Date d'activation :{" "}
						<fbt:param name="date">
							{moment(scheduledFor).format("DD/MM/YYYY")}
						</fbt:param>
					</fbt>
				</span>
				{isEditingScheduledFor && (
					<DateInput
						innerRef={dateRef}
						date={scheduledFor}
						onDateChange={date => setScheduledFor(date)}
						position="right"
					/>
				)}
			</DateContainer>
			<ReminderList>
				{mutableReminders
					.sort((a, b) => a.delay - b.delay)
					.map((reminder, index) => {
						const text = REMINDER_TYPES_DATA[reminder.type].text(
							customerName
						);

						const dataTipProps = {};

						let delay;

						if (index === 0 || !reminder.isRelative) {
							delay = (
								<fbt
									project="inyo"
									desc="after task activation"
								>
									<fbt:param name="date">
										{moment
											.duration(reminder.delay * 1000)
											.humanize()}
									</fbt:param>{" "}
									après l'activation de la tâche
								</fbt>
							);
						} else {
							delay = (
								<fbt project="inyo" desc="after previous email">
									<fbt:param name="date">
										{moment
											.duration(
												(reminder.delay -
													mutableReminders[index - 1]
														.delay) *
													1000
											)
											.humanize()}
									</fbt:param>{" "}
									après l'email précédent
								</fbt>
							);
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
											<Button
												link
												onClick={() => {
													setEditingIndex(index);
												}}
											>
												<IconButton
													icon="edit"
													size="tiny"
												/>
											</Button>
											<ReminderTestEmailButton
												taskId={taskId}
												reminder={reminder}
												preview
											/>
											<Tooltip
												label={
													<fbt
														project="inyo"
														desc="notification message"
													>
														Supprimer cette action
														automatique
													</fbt>
												}
											>
												<Button
													link
													onClick={() => {
														setReminders([
															...mutableReminders.slice(
																0,
																index
															),
															...mutableReminders.slice(
																index + 1
															)
														]);
													}}
												>
													<IconButton
														icon="cancel"
														size="tiny"
														danger
													/>
												</Button>
											</Tooltip>
										</ReminderButtons>
									</ReminderActions>
								</ReminderItem>
								<CollapsableReminderForm
									isOpen={editingIndex === index}
									onSubmit={e => {
										e.preventDefault();

										const absoluteDelay = moment.duration(
											value,
											unit
										);

										if (isRelative && index > 0) {
											absoluteDelay.add(
												mutableReminders[index - 1]
													.delay * 1000
											);
										}

										setReminders([
											...mutableReminders.slice(0, index),
											{
												...reminder,
												delay: absoluteDelay.asSeconds(),
												isRelative
											},
											...mutableReminders.slice(index + 1)
										]);

										setEditingIndex(null);
									}}
								>
									<ReminderFormGroup>
										<TimingInput
											unit={unit}
											value={value}
											isRelative={isRelative}
											setValue={setValue}
											setUnit={setUnit}
											setIsRelative={setIsRelative}
											relativeDisabled={index === 0}
										/>
									</ReminderFormGroup>
									<ReminderFormActions>
										<Button
											grey
											type="button"
											link
											aligned
											onClick={() =>
												setEditingIndex(null)
											}
										>
											<fbt project="inyo" desc="cancel">
												Annuler
											</fbt>
										</Button>
										<Button aligned type="submit">
											<fbt project="inyo" desc="confirm">
												Valider
											</fbt>
										</Button>
									</ReminderFormActions>
								</CollapsableReminderForm>
							</>
						);
					})}
			</ReminderList>
			<ReminderFormActions>
				<Button
					aligned
					grey
					type="button"
					link
					onClick={() => onCancel()}
				>
					<fbt project="inyo" desc="cancel">
						Annuler
					</fbt>
				</Button>
				<Button
					type="submit"
					aligned
					onClick={() =>
						onFocusTask({
							reminders: mutableReminders.map(r => ({
								delay: r.delay,
								type: r.type
							})),
							scheduledFor: scheduledFor.format(
								moment.HTML5_FMT.DATE
							)
						})
					}
				>
					<fbt project="inyo" desc="confirm activation">
						Valider l'activation
					</fbt>
				</Button>
			</ReminderFormActions>
		</Container>
	);
};

export default TaskRemindersPreviewsList;
