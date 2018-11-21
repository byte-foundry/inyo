import React, {Component} from 'react';
import styled from 'react-emotion';

import {Input, gray80, primaryBlue} from '../../utils/content';

const Placeholder = styled('span')`
	color: ${gray80};
`;

const NameInput = styled(Input)`
	font-size: inherit;
	padding: 2px 20px;
	position: relative;
	left: -20px;
`;

const Editable = styled('span')`
	padding: 3px 0px;
	color: ${primaryBlue};
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
		if (this.state.isEditing) {
			if (typeof this.props.onFocusOut === 'function') {
				this.props.onFocusOut(this.state.value);
			}
		}
		this.setState({
			isEditing: !this.state.isEditing,
		});
	};

	handleChange = (e) => {
		this.setState({
			value: e.target.value,
		});
	};

	render() {
		const {isEditing, value} = this.state;
		const {type, placeholder} = this.props;

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
				/>
			);
		}

		if (value) {
			return <Editable onClick={this.handleFocus}>{value}</Editable>;
		}

		return (
			<Placeholder onClick={this.handleFocus}>{placeholder}</Placeholder>
		);
	}
}

export default InlineEditable;
