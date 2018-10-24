import React, {Component} from 'react';

import {Input} from '../../utils/content';

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

		return isEditing ? (
			<Input
				type={type}
				value={value}
				onChange={this.handleChange}
				onBlur={this.handleFocus}
				placeholder={placeholder}
				autoFocus
				flexible
			/>
		) : (
			<span onClick={this.handleFocus}>{value}</span>
		);
	}
}

export default InlineEditable;
