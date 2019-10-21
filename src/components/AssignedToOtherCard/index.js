import styled from '@emotion/styled';
import React, {forwardRef} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {primaryBlack, primaryGrey} from '../../utils/new/design-system';
import Icon from '../MaterialIcon';

const Name = styled('div')`
	${props => props.done && 'text-decoration: line-through;'}
`;

const CardElem = styled(Link)`
	color: ${primaryGrey};
	padding: 5px;
	font-size: 0.75rem;
	line-height: 1;
	cursor: pointer;
	display: flex;
	align-items: flex-start;
	text-decoration: none;

	transition: all 300ms ease;

	&:hover {
		color: ${primaryBlack};
		${props => !props.done && 'text-decoration: underline;'}
	}
`;

const AssignedToOtherCard = withRouter(({
	task, location, cardRef, ...rest
}) => (
	<CardElem
		{...rest}
		ref={cardRef}
		to={{
			pathname: `/app/dashboard/${task.id}`,
			state: {prevSearch: location.search},
		}}
	>
		<Icon
			icon="face"
			size="micro"
			style={{verticalAlign: 'middle', marginRight: '5px'}}
		/>
		<Name done={task.status === 'FINISHED'}>{task.name}</Name>
	</CardElem>
));

export default forwardRef((props, ref) => (
	<AssignedToOtherCard {...props} cardRef={ref} />
));
