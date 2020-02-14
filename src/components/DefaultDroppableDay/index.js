import styled from '@emotion/styled';
import React from 'react';
import {useDrop} from 'react-dnd';

import {DRAG_TYPES} from '../../utils/constants';
import {DragSeparator} from '../../utils/new/design-system';

const Content = styled('div')`
	position: relative;
	flex: 1 0 70px;
	display: flex;
	justify-content: center;
	align-items: baseline;

	${props => props.isOver
		&& `
		background: rgba(242,242,242,.4);
		transitions: all 400ms ease;
		border-radius: 8px;
	`}
`;

function DefaultDroppableDay({
	index,
	scheduledFor,
	onMove,
	separator = true,
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
				return onMove({
					id: item.id,
					type: item.type,
					linkedCustomer: item.linkedCustomer, // we need this
					attachments: item.attachments, // and this to check for activation criteria fulfillment
					scheduledFor,
				});
			}
			return {index, scheduledFor};
		},
	});

	return (
		<Content ref={drop} isOver={isOver} {...props}>
			{isOver && separator && <DragSeparator />}
			{React.Children.map(children, (child) => {
				if (!child) return null;
				return React.cloneElement(child, {isOver, ...props});
			})}
		</Content>
	);
}

export default DefaultDroppableDay;
