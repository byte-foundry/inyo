import React from 'react';

import Tooltip from '../Tooltip';

function TimeItTookDisplay({
	timeItTook, unit, customerToken, status,
}) {
	if (status !== 'FINISHED') return false;

	const diffToBeComputed = unit !== undefined && timeItTook !== undefined;
	const diff = diffToBeComputed && timeItTook - unit;

	return (
		((customerToken && diff > 0) || !customerToken) && (
			<Tooltip label={diff > 0 ? 'Temps dépassé' : 'Temps surestimé'}>
				<span>{` (${diff > 0 ? '+' : ''}${diff})`}</span>
			</Tooltip>
		)
	);
}

export default TimeItTookDisplay;
