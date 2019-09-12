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

	return unitInHours ? (
		<fbt project="inyo" desc="hours">
			<fbt:plural
				name="hours"
				count={unitToDisplay}
				many="heures"
				value={unitToDisplay.toFixed(2)}
				showCount="yes"
			>
				heure
			</fbt:plural>
		</fbt>
	) : (
		<fbt project="inyo" desc="days">
			<fbt:plural
				name="days"
				count={unitToDisplay}
				many="jours"
				value={unitToDisplay.toFixed(2)}
				showCount="yes"
			>
				jour
			</fbt:plural>
		</fbt>
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
