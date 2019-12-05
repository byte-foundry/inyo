import styled from '@emotion/styled';
import Portal from '@reach/portal';
import {useRect} from '@reach/rect';
import React, {useRef, useState} from 'react';

import {accentGrey, Dropdown, gray80} from '../../utils/new/design-system';
import useOnClickOutside from '../../utils/useOnClickOutside';
import IconButton from '../IconButton';

const HelpAndTooltipContainer = styled('div')`
	padding: 0rem 1rem;
	color: ${gray80};
	font-size: 0.9rem;
	line-height: 1.5;
	max-width: 400px;
`;

// From https://github.com/reach/reach-ui/blob/master/packages/tooltip/src/index.js#L487-L523
const OFFSET = 8;

function positionDefault(triggerRect, targetRect) {
	const collisions = {
		top: triggerRect.top - targetRect.height < 0,
		right: window.innerWidth < triggerRect.left + targetRect.width,
		bottom:
			window.innerHeight <
			triggerRect.bottom + targetRect.height + OFFSET,
		left: triggerRect.left - targetRect.width < 0
	};

	const directionRight = collisions.right && !collisions.left;
	const directionUp = collisions.bottom && !collisions.top;

	return {
		left: directionRight
			? `${triggerRect.right - targetRect.width + window.pageXOffset}px`
			: `${triggerRect.left + window.pageXOffset}px`,
		top: directionUp
			? `${triggerRect.top -
					OFFSET -
					targetRect.height +
					window.pageYOffset}px`
			: `${triggerRect.top +
					OFFSET +
					triggerRect.height +
					window.pageYOffset}px`
	};
}

// Need a separate component so that useRect works inside the portal
const DropdownContent = ({triggerRect, children, onClose}) => {
	const ownRef = useRef(null);
	const dropdownRect = useRect(ownRef, true);

	const styles = dropdownRect
		? positionDefault(triggerRect, dropdownRect)
		: {visibility: 'hidden'};

	useOnClickOutside(ownRef, () => {
		onClose();
	});

	return (
		<Dropdown
			style={{
				position: 'absolute',
				...styles
			}}
			ref={ownRef}
		>
			<HelpAndTooltipContainer children={children} />
		</Dropdown>
	);
};

const HelpAndTooltip = ({icon = 'help', children}) => {
	const [open, setOpen] = useState(false);
	const iconRef = useRef();
	const triggerRect = useRect(iconRef);

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
					<DropdownContent
						triggerRect={triggerRect}
						children={children}
						onClose={() => setOpen(false)}
					/>
				</Portal>
			)}
		</>
	);
};

export default HelpAndTooltip;
