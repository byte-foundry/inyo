import moment from 'moment';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import useUserInfos from '../../utils/useUserInfos';

const UnitDisplay = ({unit}) => {
	const {workingTime = 8} = useUserInfos();

	if (unit === 0) {
		return '—';
	}

	let unitInHours = false;

	let unitToDisplay = unit;

	if (unit < 1) {
		unitToDisplay *= workingTime;
		unitInHours = true;
	}

	return unitInHours
		? moment.duration(unitToDisplay, 'hours').humanize()
		: moment.duration(unitToDisplay, 'days').humanize();
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
				many="supplémentaires"
			>
				supplémentaire
			</fbt:plural>
		</fbt>
	</>
);

export default UnitDisplay;
