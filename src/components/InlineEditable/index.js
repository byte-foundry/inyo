import React, {useState, useCallback, useRef} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {Input, gray50} from '../../utils/content';
import {lightGrey, accentGrey} from '../../utils/new/design-system';
import Pencil from '../../utils/icons/pencil.svg';

const Placeholder = styled('span')`
	color: ${gray50};
	${props => props.css};
`;

const NameInput = styled(Input)`
	font-size: inherit;
	${props => props.css};
`;

const Editable = styled('span')`
	position: relative;
	border: 1px solid transparent;
	border-radius: 8px;

	${props => !props.disabled
		&& css`
			&:hover {
				cursor: text;
				border: 1px solid transparent;
				background: ${lightGrey};

				&:after {
					content: '';
					display: block;
					background-color: ${accentGrey};
					mask-size: 35%;
					mask-position: center;
					mask-repeat: no-repeat;
					mask-image: url(${Pencil});
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					width: 50px;
				}
			}
		`}

	${props => props.css};
`;

function InlineEditable({
	isEditing: isEditingProps,
	value: valueProps,
	disabled,
	onFocusOut,
	type,
	placeholder,
	className,
	innerRef,
	nameCss,
	editableCss,
	placeholderCss,
}) {
	const [isEditing, setIsEditing] = useState(isEditingProps || false);
	const [value, setValue] = useState(valueProps);

	const handleFocus = useCallback(() => {
		if (disabled) return;

		let shouldBeCleared = false;

		if (isEditing) {
			shouldBeCleared = onFocusOut(value);
		}
		setIsEditing(!isEditing);
		setValue(shouldBeCleared ? '' : value);
	}, [isEditing, value, disabled, onFocusOut]);

	const handleChange = useRef((e) => {
		setValue(e.target.value);
	});

	if (isEditing) {
		return (
			<NameInput
				ref={innerRef}
				type={type}
				value={value}
				onChange={handleChange.current}
				onBlur={handleFocus}
				placeholder={placeholder}
				autoFocus
				flexible
				className={className}
				css={nameCss}
				onKeyPress={(e) => {
					if (e.key === 'Enter') {
						e.target.blur();
					}
				}}
			/>
		);
	}

	if (value) {
		return (
			<Editable
				className={className}
				onClick={handleFocus}
				disabled={disabled}
				css={editableCss}
			>
				{value}
			</Editable>
		);
	}

	return (
		<Placeholder
			className={className}
			onClick={handleFocus}
			disabled={disabled}
			css={placeholderCss}
		>
			{placeholder}
		</Placeholder>
	);
}

InlineEditable.defaultProps = {
	onFocusOut: () => {},
};

export default InlineEditable;
