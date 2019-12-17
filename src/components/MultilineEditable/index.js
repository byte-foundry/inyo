import styled from '@emotion/styled';
import escapeHtml from 'escape-html';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {Remarkable} from 'remarkable';
import {linkify} from 'remarkable/linkify';

import {mediumPurple} from '../../utils/new/design-system';

const md = new Remarkable({breaks: true}).use(linkify);

const EditableArea = styled('div')`
	width: 100%;

	:empty::before {
		content: attr(placeholder);
		display: block;
		font-style: italic;
		font-size: 13px;
		color: ${mediumPurple};
	}
`;

const MultilineEditable = ({
	children,
	onBlur,
	onChange,
	defaultValue,
	disabled,
	...rest
}) => {
	const inputRef = useRef(null);
	const [isEditing, setEditing] = useState(false);

	useEffect(() => {
		if (inputRef.current) {
			const el = inputRef.current;

			el.focus();

			if (
				typeof window.getSelection !== 'undefined'
				&& typeof document.createRange !== 'undefined'
			) {
				const range = document.createRange();

				range.selectNodeContents(el);
				range.collapse(false);
				const sel = window.getSelection();

				sel.removeAllRanges();
				sel.addRange(range);
			}
			else if (typeof document.body.createTextRange !== 'undefined') {
				const textRange = document.body.createTextRange();

				textRange.moveToElementText(el);
				textRange.collapse(false);
				textRange.select();
			}
		}
	});

	return (
		<EditableArea
			ref={inputRef}
			onClick={() => !disabled && setEditing(true)}
			contentEditable={isEditing && !disabled}
			onInput={(e) => {
				if (!e.target.textContent.trim().length) {
					e.target.innerHTML = '';
				}

				// onChange(e);
			}}
			onBlur={(e) => {
				onBlur(e);
				setEditing(false);
			}}
			dangerouslySetInnerHTML={{
				__html: isEditing
					? escapeHtml(defaultValue).replace(/\n/g, '<br>')
					: md.render(defaultValue),
			}}
			{...rest}
		/>
	);
};

MultilineEditable.propTypes = {
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};

MultilineEditable.defaultProps = {
	onChange: () => {},
	disabled: false,
};

export default MultilineEditable;
