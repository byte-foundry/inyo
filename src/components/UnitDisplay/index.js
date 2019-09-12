import React from 'react';

import fbt from '../../fbt/fbt.macro';
import useUserInfos from '../../utils/useUserInfos';

const UnitDisplay = ({unit}) => {
	const {workingTime = 8} = useUserInfos();

	let unitInHours = false;

	let unitToDisplay = unit;

	if (unit < 1) {
		unitToDisplay *= workingTime;
		unitInHours = true;
	}

	return (
		<>
			{+unitToDisplay.toFixed(2)}{' '}
			{unitInHours ? (
				<fbt project="inyo" desc="hours">
					<fbt:plural name="hour" count={unitToDisplay} many="heures">
						heure
					</fbt:plural>
				</fbt>
			) : (
				<fbt project="inyo" desc="days">
					<fbt:plural name="day" count={unitToDisplay} many="jours">
						jour
					</fbt:plural>
				</fbt>
			)}
		</>
	);
};

export const UnitWorkedDisplay = props => (
	<>
		<UnitDisplay {...props} />{' '}
		{props.unit < 1 ? (
			<fbt project="inyo" desc="hours">
				<fbt:plural
					name="travaillé féminin"
					count={props.unit}
					many="travaillées"
				>
					travaillée
				</fbt:plural>
			</fbt>
		) : (
			<fbt project="inyo" desc="hours">
				<fbt:plural
					name="travaillé masculin"
					count={props.unit}
					many="travaillés"
				>
					travaillé
				</fbt:plural>
			</fbt>
		)}
	</>
);

export const UnitAvailableDisplay = props => (
	<>
		<UnitDisplay {...props} />{' '}
		<fbt project="inyo" desc="hours">
			<fbt:plural
				name="encore disponible"
				count={props.unit}
				many="encore disponibles"
			>
				encore disponible
			</fbt:plural>
		</fbt>
	</>
);

export const UnitOvertimeDisplay = props => (
	<>
		<UnitDisplay {...props} />{' '}
		<fbt project="inyo" desc="hours">
			<fbt:plural
				name="travaillé féminin"
				count={props.unit}
				many="supplémentaire"
			>
				supplémentaires
			</fbt:plural>
		</fbt>
	</>
);

export default UnitDisplay;
