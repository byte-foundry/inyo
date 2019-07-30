import React from 'react';

import useUserInfos from '../../utils/useUserInfos';
import Plural from '../Plural';

const UnitDisplay = ({
	unit,
	plural,
	singular,
	pluralF,
	singularF,
	pluralM,
	singularM,
}) => {
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
				<Plural
					value={unitToDisplay}
					singular="heure"
					plural="heures"
				/>
			) : (
				<Plural value={unitToDisplay} singular="jour" plural="jours" />
			)}
			{unitInHours && pluralF && singularF && (
				<Plural
					plural={pluralF}
					singular={singularF}
					value={unitToDisplay}
				/>
			)}
			{!unitInHours && pluralM && singularM && (
				<Plural
					plural={pluralM}
					singular={singularM}
					value={unitToDisplay}
				/>
			)}
			{!pluralF
				&& !singularF
				&& !pluralM
				&& !singularM
				&& plural
				&& singular && (
				<Plural
					plural={plural}
					singular={singular}
					value={unitToDisplay}
				/>
			)}
		</>
	);
};

export default UnitDisplay;
