import React from 'react';
import styled from 'react-emotion';

import ModalWithHoursAndDays from '../../../components/ModalWithHoursAndDays';

const ConditionalContentMain = styled('div')``;

export default function ConditionalContent(props) {
	const {workingDays, startWorkAt, endWorkAt} = props.user;

	return (
		<ConditionalContentMain>
			{(!workingDays || !startWorkAt || !endWorkAt) && (
				<ModalWithHoursAndDays data={props.user} />
			)}
		</ConditionalContentMain>
	);
}
