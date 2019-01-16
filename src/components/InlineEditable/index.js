import React, {Component} from 'react';
import styled from '@emotion/styled';

import {Input, gray50, primaryBlue} from '../../utils/content';

const Placeholder = styled('span')`
	color: ${gray50};
	${props => props.css};
`;

const NameInput = styled(Input)`
	font-size: inherit;
	${props => props.css};
`;

const Editable = styled('span')`
	color: ${primaryBlue};
	${props => props.css};
`;

class InlineEditable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEditing: props.isEditing || false,
			value: props.value,
		};
	}

	handleFocus = () => {
		if (this.props.disabled) return;

		let shouldBeCleared = false;

		if (this.state.isEditing) {
			shouldBeCleared = this.props.onFocusOut(this.state.value);
		}
		this.setState(state => ({
			value: shouldBeCleared ? '' : state.value,
			isEditing: !this.state.isEditing,
		}));
	};

	handleChange = (e) => {
		this.setState({
			value: e.target.value,
		});
	};

	render() {
		const {isEditing, value} = this.state;
		const {type, placeholder, className} = this.props;

		if (isEditing) {
			return (
				<NameInput
					type={type}
					value={value}
					onChange={this.handleChange}
					onBlur={this.handleFocus}
					placeholder={placeholder}
					autoFocus
					flexible
					className={className}
					css={this.props.nameCss}
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
					onClick={this.handleFocus}
					css={this.props.editableCss}
				>
					{value}
				</Editable>
			);
		}

		return (
			<Placeholder
				className={className}
				onClick={this.handleFocus}
				css={this.props.placeholderCss}
			>
				{placeholder}
			</Placeholder>
		);
	}
}

InlineEditable.defaultProps = {
	onFocusOut: () => {},
};

export default InlineEditable;
