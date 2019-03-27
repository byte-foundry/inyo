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
	variables,
}) => (
	<Button
		data-tip={value ? trueTooltip : falseTooltip}
		icon={value && '✓'}
		white={!value}
		onClick={() => {
			if (value) {
				reverse({
					variables,
				});
			}
			else {
				commit({
					variables,
				});
			}
		}}
		disabled={disabled}
	>
		{value ? trueLabel : falseLabel}
	</Button>
);

export default BistableButton;
