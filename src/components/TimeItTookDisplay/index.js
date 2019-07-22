import React from 'react';

import Tooltip from '../Tooltip';

function TimeItTookDisplay({timeItTook, unit, displayForCustomer}) {
	const diffToBeComputed = unit !== undefined && timeItTook !== undefined;
	const diff = diffToBeComputed && timeItTook - unit;

	return (
		((displayForCustomer && diff > 0) || !displayForCustomer) && (
			<Tooltip label={diff > 0 ? 'Temps dépassé' : 'Temps surestimé'}>
				<span>{` (${diff > 0 ? '+' : ''}${diff})`}</span>
			</Tooltip>
		)
	);
}

export default TimeItTookDisplay;
