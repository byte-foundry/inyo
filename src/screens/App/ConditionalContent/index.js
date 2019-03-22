import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';

import ModalWithHoursAndDays from '../../../components/ModalWithHoursAndDays';
import {GET_USER_INFOS} from '../../../utils/queries';

const ConditionalContentMain = styled('div')``;

export default function ConditionalContent() {
	const {
		data: {me},
		loading,
	} = useQuery(GET_USER_INFOS);
	const {workingDays, startWorkAt, endWorkAt} = me;

	return (
		<ConditionalContentMain>
			{(!workingDays || !startWorkAt || !endWorkAt) && (
				<ModalWithHoursAndDays data={me} />
			)}
		</ConditionalContentMain>
	);
}
