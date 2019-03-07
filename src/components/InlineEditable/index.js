import React, {Component} from 'react';
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

	${props => !props.disabled
		&& css`
			&:hover {
				cursor: text;
				border: 1px solid transparent;
				background: ${lightGrey};
				border-radius: 8px;

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
		const {
			type, placeholder, className, innerRef, disabled,
		} = this.props;

		if (isEditing) {
			return (
				<NameInput
					ref={innerRef}
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
					disabled={disabled}
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
				disabled={disabled}
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
