import React from 'react';

import {Button} from '../../utils/new/design-system';

const BistableButton = ({
	value,
	disabled,
	trueLabel,
	trueTooltip,
	falseLabel,
	falseTooltip,
	commit,
	reverse,
	white,
	primary,
}) => (
	<Button
		data-tip={value ? trueTooltip : falseTooltip}
		white={white}
		primary={primary}
		icon={value ? '×' : '✓'}
		onClick={() => {
			if (value) {
				reverse();
			}
			else {
				commit();
			}
		}}
		disabled={disabled}
	>
		{value ? trueLabel : falseLabel}
	</Button>
);

export default BistableButton;
