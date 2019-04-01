import React from 'react';

function TimeItTookDisplay({
	timeItTook, unit, customerToken, status,
}) {
	if (status !== 'FINISHED') return false;

	const diffToBeComputed = unit !== undefined && timeItTook !== undefined;
	const diff = diffToBeComputed && timeItTook - unit;

	return (
		((customerToken && diff > 0) || !customerToken) && (
			<span data-tip={diff > 0 ? 'Temps dépassé' : 'Temps surestimé'}>
				{` (${diff > 0 ? '+' : ''}${diff})`}
			</span>
		)
	);
}

export default TimeItTookDisplay;
