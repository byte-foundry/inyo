import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import Dropzone from 'react-dropzone';

import {
	P,
	Label,
	ErrorInput,
	FlexRow,
	gray70,
	gray50,
} from '../../utils/content';

const FileInputMain = styled(P)`
	width: 100%;
	margin: ${props => (props.padded ? '17px 10px 25.5px 10px' : '17px 0 25.5px 0')};
	${props => props.inline
		&& css`
			margin: 0;
		`};
	${props => props.onboarding
		&& css`
			margin: 10px 15px 10px 16px;
			width: inherit;
		`};
`;

const FileInputContainer = styled(FlexRow)`
	align-items: flex-start;
`;

const StyledDropZone = styled(Dropzone)`
	border: 1px solid ${gray70};
	padding: 15px 18px 16px 18px;
	color: ${gray50};
	width: 46%;

	p {
		font-size: 11px;
	}
`;

const PreviewContainer = styled('div')`
	width: 50%;
	padding-left: 15px;
	img {
		width: 100%;
		height: auto;
	}
`;

class FileInput extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	onDrop = (files) => {
		this.props.onChange(this.props.name, files[0]);
		this.setState({
			preview: URL.createObjectURL(files[0]),
		});
	};

	componentWillUnmount() {
		// Make sure to revoke the data uris to avoid memory leaks
		const {preview} = this.state;

		URL.revokeObjectURL(preview);
	}

	render() {
		const {
			name,
			label,
			placeholder,
			type,
			values,
			handleChange,
			handleBlur,
			errors,
			touched,
			required,
			padded,
			inline,
			onboarding,
			defaultValue,
		} = this.props;

		return (
			<FileInputMain
				padded={padded}
				inline={inline}
				onboarding={onboarding}
			>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						{label}
					</Label>
				)}
				<FileInputContainer justifyContent="space-between">
					<StyledDropZone accept="image/*" onDrop={this.onDrop}>
						<p>Glissez votre logo d'entreprise ici</p>
						<p>Ou cliquez pour sélectionner un fichier à ajouter</p>
					</StyledDropZone>
					<PreviewContainer>
						{(defaultValue || this.state.preview) && (
							<img
								src={this.state.preview || defaultValue.url}
								alt="Company Logo"
							/>
						)}
					</PreviewContainer>
				</FileInputContainer>

				{errors[name]
					&& touched[name] && (
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</FileInputMain>
		);
	}
}

export default FileInput;
