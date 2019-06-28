import React from 'react';

import {Button} from '../../utils/new/design-system';
import Tooltip from '../Tooltip';

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
	id,
}) => (
	<Tooltip label={value ? trueTooltip : falseTooltip}>
		<Button
			id={id}
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
	</Tooltip>
);

export default BistableButton;
