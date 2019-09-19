import styled from '@emotion/styled';
import React from 'react';

import ModalWithHoursAndDays from '../../../components/ModalWithHoursAndDays';
import {useQuery} from '../../../utils/apollo-hooks';
import {GET_USER_INFOS} from '../../../utils/queries';

const ConditionalContentMain = styled('div')``;

export default function ConditionalContent() {
	const {data, loading} = useQuery(GET_USER_INFOS, {suspend: false});

	if (loading) {
		return false;
	}

	const {workingDays, startWorkAt, endWorkAt} = data.me;

	return (
		<ConditionalContentMain>
			{(!workingDays || !startWorkAt || !endWorkAt) && (
				<ModalWithHoursAndDays data={data.me} />
			)}
		</ConditionalContentMain>
	);
}
