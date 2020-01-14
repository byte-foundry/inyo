import styled from '@emotion/styled/macro';
import {isKeyHotkey} from 'is-hotkey';
import React, {useRef, useState} from 'react';
import {Value} from 'slate';
import {Editor} from 'slate-react';

import fbt from '../../fbt/fbt.macro';
import {Button, lightPurple} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');

const Container = styled('div')`
	border: 1px solid ${lightPurple};
	padding: 1rem;
	border-radius: 5px;
	margin-bottom: 2rem;
`;

const FormatButton = styled(Button)`
	margin-right: 5px;
	padding: 0;
	text-align: center;

	i {
		margin: 2px;
	}

	&:hover {
		i {
			color: white;
		}
	}
`;

const FormatButtons = styled('div')`
	display: flex;
	margin-bottom: 1rem;
`;

const INITIAL_EDITOR_VALUE = {
	object: 'value',
	document: {
		object: 'document',
		nodes: [
			{
				object: 'block',
				type: 'paragraph',
				nodes: [
					{
						object: 'text',
						text: '',
					},
				],
			},
		],
	},
};

const RichTextEditor = ({
	defaultValue, onChange, displayMode, placeholder,
}) => {
	const [value, setValue] = useState(
		Value.fromJSON(defaultValue || INITIAL_EDITOR_VALUE),
	);
	const editorRef = useRef();

	const renderMark = (props, editor, next) => {
		const {children, mark, attributes} = props;

		switch (mark.type) {
		case 'bold':
			return <strong {...attributes}>{children}</strong>;
		case 'italic':
			return <em {...attributes}>{children}</em>;
		case 'underlined':
			return <u {...attributes}>{children}</u>;
		default:
			return next();
		}
	};

	if (displayMode) {
		return (
			<Editor
				readOnly
				spellCheck
				autoFocus
				ref={editorRef}
				value={value}
				renderMark={renderMark}
			/>
		);
	}

	const onClickMark = (event, type) => {
		event.preventDefault();
		editorRef.current.toggleMark(type);
	};

	return (
		<Container>
			<FormatButtons>
				<FormatButton
					active={value.activeMarks.some(
						mark => mark.type === 'bold',
					)}
					onMouseDown={event => onClickMark(event, 'bold')}
				>
					<MaterialIcon icon="format_bold" size="tiny" />
				</FormatButton>
				<FormatButton
					active={value.activeMarks.some(
						mark => mark.type === 'italic',
					)}
					onMouseDown={event => onClickMark(event, 'italic')}
				>
					<MaterialIcon icon="format_italic" size="tiny" />
				</FormatButton>
				<FormatButton
					active={value.activeMarks.some(
						mark => mark.type === 'underlined',
					)}
					onMouseDown={event => onClickMark(event, 'underlined')}
				>
					<MaterialIcon icon="format_underline" size="tiny" />
				</FormatButton>
			</FormatButtons>
			<Editor
				spellCheck
				autoFocus
				placeholder={placeholder._contents[0]}
				ref={editorRef}
				value={value}
				onChange={({value}) => {
					setValue(value);
					onChange(value);
				}}
				onKeyDown={(event, editor, next) => {
					let mark;

					if (isBoldHotkey(event)) {
						mark = 'bold';
					}
					else if (isItalicHotkey(event)) {
						mark = 'italic';
					}
					else if (isUnderlinedHotkey(event)) {
						mark = 'underlined';
					}
					else {
						return next();
					}

					event.preventDefault();
					editor.toggleMark(mark);
				}}
				renderMark={renderMark}
			/>
		</Container>
	);
};

export default RichTextEditor;
