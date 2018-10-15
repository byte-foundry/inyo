import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {convertToRaw} from 'draft-js';
import {Editor, createEditorState} from 'medium-draft';
import {
	BLOCK_BUTTONS,
	INLINE_BUTTONS,
} from 'medium-draft/lib/components/toolbar';
import styled from 'react-emotion';
import 'medium-draft/lib/index.css';

import CustomImageSideButton from './custom-image-side-button';

const TextEditorMain = styled('div')`
	border: 1px solid black;
	margin: 10px 20px;
	border-radius: 5px;
	height: 100%;
`;

class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.sideButtons = [
			{
				title: 'Image',
				component: CustomImageSideButton,
			},
		];
		// default: block: ['ordered-list-item', 'unordered-list-item', 'blockquote', 'header-three', 'todo']
		// inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink', 'HIGHLIGHT']
		BLOCK_BUTTONS.unshift({
			description: 'Heading 1',
			icon: 'header',
			label: 'H1',
			style: 'header-one',
		});
		BLOCK_BUTTONS.unshift({
			description: 'Heading 2',
			icon: 'header',
			label: 'H2',
			style: 'header-two',
		});
		this.toolbarConfig = {
			block: [
				'header-one',
				'header-two',
				'header-three',
				'ordered-list-item',
				'unordered-list-item',
				'blockquote',
			],
			inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink'],
		};
		this.state = {editorState: createEditorState(props.currentContent)};
		this.onChange = (editorState) => {
			this.props.onChange(convertToRaw(editorState.getCurrentContent()));
			this.setState({editorState});
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.templateName !== this.props.templateName) {
			this.setState({
				editorState: createEditorState(newProps.currentContent),
			});
		}
	}

	focusEditor = () => {
		this.editor.focus();
	};

	render() {
		return (
			<TextEditorMain onClick={this.focusEditor}>
				<Editor
					editorState={this.state.editorState}
					onChange={this.onChange}
					sideButtons={this.sideButtons}
					toolbarConfig={this.toolbarConfig}
					placeholder="Write here ..."
					ref={(element) => {
						this.editor = element;
					}}
				/>
			</TextEditorMain>
		);
	}
}

export default TextEditor;
