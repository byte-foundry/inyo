import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {convertToRaw} from 'draft-js';
import {Editor, createEditorState} from 'medium-draft';
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
		this.state = {editorState: createEditorState(props.currentContent)};
		this.onChange = (editorState) => {
			this.props.onChange(convertToRaw(editorState.getCurrentContent()));
			this.setState({editorState});
		};
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
					placeholder="Write here..."
					ref={(element) => {
						this.editor = element;
					}}
				/>
			</TextEditorMain>
		);
	}
}

export default TextEditor;
