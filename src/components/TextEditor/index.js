import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {convertToRaw} from 'draft-js';
import {Editor, createEditorState} from 'medium-draft';
import styled from 'react-emotion';
import 'medium-draft/lib/index.css';

import CustomImageSideButton from './custom-image-side-button';

const TextEditorMain = styled('div')``;

class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.sideButtons = [
			{
				title: 'Image',
				component: CustomImageSideButton,
			},
		];
		this.state = {editorState: createEditorState()};
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
