import React from 'react';

import fbt from '../../fbt/fbt.macro';
import TimingInput from '../TimingInput';

const CustomEmailTimingInput = ({
	unit,
	value,
	isRelative,
	setValue,
	setUnit,
	setIsRelative,
	relativeDisabled,
}) => (
	<div style={{display: 'flex', alignItems: 'center'}}>
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
	</div>
);

export default CustomEmailTimingInput;
