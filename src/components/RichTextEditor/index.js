import styled from '@emotion/styled/macro';
import {isKeyHotkey} from 'is-hotkey';
import React, {useRef, useState} from 'react';
import {Value} from 'slate';
import {Editor} from 'slate-react';

import fbt from '../../fbt/fbt.macro';
import {Button} from '../../utils/new/design-system';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');

const Container = styled('div')`
	border: 1px solid black;
	padding: 5px;
	border-radius: 5px;
	margin-bottom: 1rem;
`;

const FormatButton = styled(Button)`
	margin-right: 5px;
`;

const FormatButtons = styled('div')`
	display: flex;
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

const RichTextEditor = ({defaultValue, onChange}) => {
	const [value, setValue] = useState(
		Value.fromJSON(defaultValue || INITIAL_EDITOR_VALUE),
	);
	const editorRef = useRef();

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
					<fbt desc="rich text editor bold button">Gras</fbt>
				</FormatButton>
				<FormatButton
					active={value.activeMarks.some(
						mark => mark.type === 'italic',
					)}
					onMouseDown={event => onClickMark(event, 'italic')}
				>
					<fbt desc="rich text editor italic button">Italique</fbt>
				</FormatButton>
				<FormatButton
					active={value.activeMarks.some(
						mark => mark.type === 'underlined',
					)}
					onMouseDown={event => onClickMark(event, 'underlined')}
				>
					<fbt desc="rich text editor underline button">Souligné</fbt>
				</FormatButton>
			</FormatButtons>
			<Editor
				spellCheck
				autoFocus
				placeholder="Enter some rich text..."
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
				renderMark={(props, editor, next) => {
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
				}}
			/>
		</Container>
	);
};

export default RichTextEditor;
