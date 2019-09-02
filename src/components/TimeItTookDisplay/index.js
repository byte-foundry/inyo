import React from 'react';

import fbt from '../../fbt/fbt.macro';
import Tooltip from '../Tooltip';

function TimeItTookDisplay({timeItTook, unit, displayForCustomer}) {
	const diffToBeComputed = unit !== undefined && timeItTook !== undefined;
	const diff = diffToBeComputed && timeItTook - unit;

	return (
		((displayForCustomer && diff > 0) || !displayForCustomer) && (
			<Tooltip
				label={
					diff > 0 ? (
						<fbt project="inyo" desc="overrun time">
							Temps dépassé
						</fbt>
					) : (
						<fbt project="inyo" desc="overestimated time">
							Temps surestimé
						</fbt>
					)
				}
			>
				<span>{` (${diff > 0 ? '+' : ''}${diff.toFixed(2)})`}</span>
			</Tooltip>
		)
	);
}

export default TimeItTookDisplay;
