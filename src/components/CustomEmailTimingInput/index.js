import styled from '@emotion/styled/macro';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import TimingInput from '../TimingInput';

const Container = styled('span')`
	display: flex;
	align-items: center;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: grid;
	}
`;

const CustomEmailTimingInput = ({
	unit,
	value,
	isRelative,
	setValue,
	setUnit,
	setIsRelative,
	relativeDisabled,
}) => (
	<Container>
		<fbt desc="email timing intro">Cet email est envoyé</fbt>{' '}
		<TimingInput
			unit={unit}
			value={value}
			isRelative={isRelative}
			setUnit={setUnit}
			setValue={setValue}
			setIsRelative={setIsRelative}
			relativeDisabled={relativeDisabled}
		/>
	</Container>
);

export default CustomEmailTimingInput;
