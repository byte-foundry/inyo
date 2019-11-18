import styled from '@emotion/styled';
import Portal from '@reach/portal';
import React, {useRef, useState} from 'react';

import {accentGrey, Dropdown, gray80} from '../../utils/new/design-system';
import useOnClickOutside from '../../utils/useOnClickOutside';
import IconButton from '../IconButton';

const HelpAndTooltipContainer = styled('div')`
	padding: 0rem 1rem;
	color: ${gray80};
	font-size: 0.9rem;
	line-height: 1.5;
`;

const HelpAndTooltip = ({icon = 'help', children}) => {
	const [open, setOpen] = useState(false);
	const tooltipRef = useRef();
	const iconRef = useRef();

	useOnClickOutside(tooltipRef, () => {
		setOpen(false);
	});

	return (
		<>
			<IconButton
				icon={icon}
				ref={iconRef}
				size="tiny"
				color={accentGrey}
				onClick={() => setOpen(!open)}
			/>
			{open && (
				<Portal>
					<Dropdown
						style={{
							position: 'absolute',
							top:
								iconRef.current.getBoundingClientRect().top
								+ window.scrollY,
							left: iconRef.current.getBoundingClientRect().right,
						}}
						ref={tooltipRef}
					>
						<HelpAndTooltipContainer>
							{children}
						</HelpAndTooltipContainer>
					</Dropdown>
				</Portal>
			)}
		</>
	);
};

export default HelpAndTooltip;
