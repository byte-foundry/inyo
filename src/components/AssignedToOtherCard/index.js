import styled from '@emotion/styled';
import React, {forwardRef} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {primaryBlack, primaryGrey} from '../../utils/new/design-system';
import Icon from '../MaterialIcon';

const CardElem = styled(Link)`
	color: ${primaryGrey};
	padding: 5px;
	font-size: 0.75rem;
	line-height: 1;
	cursor: pointer;

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
		{task.name}
	</CardElem>
));

export default forwardRef((props, ref) => (
	<AssignedToOtherCard {...props} cardRef={ref} />
));
