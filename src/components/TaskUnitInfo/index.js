import React, {useCallback, useState} from 'react';

import {accentGrey, TaskIconText} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';
import Plural from '../Plural';
import TimeItTookDisplay from '../TimeItTookDisplay';
import UnitInput from '../UnitInput';

function TaskUnitInfo({
	customerToken,
	item,
	onUnitSubmit,
	startOpen,
	switchOnSelect,
	setEditDueDate,
}) {
	const [editUnit, setEditUnit] = useState(startOpen);

	let unitToDisplay
		= item.timeItTook === null || item.timeItTook === undefined
			? item.unit
			: item.timeItTook;

	let unitInHours = false;

	if (unitToDisplay < 1) {
		unitToDisplay *= 8;
		unitInHours = true;
	}

	const onBlurUnitInput = useCallback(
		(args) => {
			onUnitSubmit(args);
			setEditUnit(false);
		},
		[onUnitSubmit, setEditUnit],
	);
	const onSubmitUnitInput = useCallback(
		(args) => {
			onUnitSubmit(args);
			setEditUnit(false);
			if (switchOnSelect) {
				setEditDueDate(true);
			}
		},
		[onUnitSubmit, setEditUnit, switchOnSelect, setEditDueDate],
	);
	const onTabUnitInput = useCallback(
		(args) => {
			onUnitSubmit(args);
			setEditUnit(false);
			setEditDueDate(true);
		},
		[onUnitSubmit, setEditUnit, setEditDueDate],
	);
	const onClickElem = useCallback(() => {
		if (!customerToken) {
			setEditUnit(true);
		}
	}, [customerToken, setEditUnit]);

	return (
		<TaskIconText
			inactive={editUnit}
			icon={<MaterialIcon icon="timer" size="tiny" color={accentGrey} />}
			content={
				!customerToken && editUnit ? (
					<UnitInput
						unit={item.timeItTook ? item.timeItTook : item.unit}
						onBlur={onBlurUnitInput}
						onSubmit={onSubmitUnitInput}
						onTab={onTabUnitInput}
					/>
				) : (
					<div onClick={onClickElem}>
						{+unitToDisplay.toFixed(2)}{' '}
						{!unitInHours && (
							<Plural
								value={unitToDisplay}
								singular="jour"
								plural="jours"
							/>
						)}
						{unitInHours && (
							<Plural
								value={unitToDisplay}
								singular="heure"
								plural="heures"
							/>
						)}
						<TimeItTookDisplay
							timeItTook={item.timeItTook}
							unit={item.unit}
							customerToken={customerToken}
							status={item.status}
						/>
					</div>
				)
			}
		/>
	);
}

export default TaskUnitInfo;
