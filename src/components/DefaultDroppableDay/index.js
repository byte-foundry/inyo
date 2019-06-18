import React from 'react';
import {useDrop} from 'react-dnd';

import {DRAG_TYPES} from '../../utils/constants';

function DefaultDroppableDay({
	index,
	scheduledFor,
	onMove,
	children,
	...props
}) {
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop(item) {
			if (typeof item.index !== 'number') {
				return onMove({id: item.id, scheduledFor});
			}
			return {index, scheduledFor};
		},
	});

	return (
		<>
			{React.cloneElement(children, {
				ref: drop,
				isOver,
				...props,
			})}
		</>
	);
}

export default DefaultDroppableDay;
