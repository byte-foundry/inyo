import React from 'react';
import styled from '@emotion/styled';

import {
	Input, Button, gray30, primaryBlue,
} from '../../utils/content';

const Container = styled('div')`
	display: flex;
`;

const Switch = styled('div')`
	display: flex;
	flex-direction: column;
`;

const SwitchButton = styled(Button)`
	border-radius: 0;
	padding: 0 5px;
	flex: 1;
	border: solid 1px ${gray30};
	font-size: 13px;

	${props => props.selected
		&& `
		background: ${primaryBlue};
		color: #fff;
		border: solid 1px ${primaryBlue};
	`} border-left: none;
`;

class UnitInput extends React.Component {
	state = {
		isHours: false,
		value: this.props.value,
		displayedValue: this.props.value,
	};

	handleChange = (e) => {
		const {isHours} = this.state;
		const {value} = e.target;

		this.setState({
			value: isHours ? value / 8 : value,
			displayedValue: value,
		});
		this.props.onChange({value: isHours ? value / 8 : value});
	};

	toggleHours = (isHours) => {
		this.setState(state => ({
			isHours,
			displayedValue: isHours ? state.value * 8 : state.value,
		}));
	};

	render() {
		const {
			onChange, name, id, ...props
		} = this.props;
		const {isHours, displayedValue} = this.state;

		return (
			<Container>
				<Input
					{...props}
					onChange={this.handleChange}
					value={displayedValue}
				/>
				<Switch>
					<SwitchButton
						theme="Outline"
						onClick={() => this.toggleHours(false)}
						selected={!isHours}
					>
						Jours
					</SwitchButton>
					<SwitchButton
						theme="Outline"
						onClick={() => this.toggleHours(true)}
						selected={isHours}
					>
						Heures
					</SwitchButton>
				</Switch>
			</Container>
		);
	}
}

export default UnitInput;
