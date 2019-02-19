import React, {useState} from 'react';
import styled from '@emotion/styled';

import {
	Input, Button, gray30, primaryBlue,
} from '../../utils/content';
import {primaryPurple, primaryWhite} from '../../utils/new/design-system';

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

const UnitInputContainer = styled('div')`
	display: flex;
`;

const UnitInputInput = styled('input')`
	padding: 0 2rem;
	width: 20px;
	margin-right: -1.2rem;
	background-color: #f5f2fe;
	border-radius: 20px;
	height: 27px;
	border: 1px solid transparent;
	font-weight: 600;
	color: ${primaryPurple};
`;

const UnitInputSwitch = styled('label')`
	position: relative;
	display: inline-block;
	width: 100px;
	height: 29px;
`;

const UnitInputLabel = styled('span')`
	position: absolute;
	top: 20%;
	color: ${primaryPurple};
	right: 1rem;
	z-index: 1;

	&:first-child {
		left: 1rem;
	}
`;

const UnitInputSlider = styled('span')`
	position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: -2px;
    bottom: 0;
    background-color: ${primaryWhite};
    transition: .4s;
    border-radius: 29px;
    border: 2px solid #DDD;

	&::before {
		position: absolute;
		content: '${props => props.content}';
		font-family: 'Work Sans', sans-serif;
		font-size: 12px;
		line-height: 21px;
		height: 21px;
		width: auto;
		left: 2px;
		bottom: 2px;
		background-color: #5020ee;
		color: #FFF;
		transition: .4s;
		border-radius: 16px;
		padding: 0 .8rem;
		z-index: 2;
	}
`;

export default function ({value}) {
	const [isHours, setIsHours] = useState(false);

	return (
		<UnitInputContainer>
			<UnitInputInput value={value} />
			<UnitInputSwitch>
				<UnitInputLabel>J</UnitInputLabel>
				<UnitInputLabel>h</UnitInputLabel>
				<UnitInputSlider content="Jours" />
			</UnitInputSwitch>
		</UnitInputContainer>
	);
}

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
