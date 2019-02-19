import React, {useState, useEffect, useRef} from 'react';
import styled from '@emotion/styled';
import useOnClickOutside from 'use-onclickoutside';
import {Formik} from 'formik';
import * as Yup from 'yup';

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
	width: 30px;
	margin-right: calc(-1.2rem - 10px);
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
	cursor: pointer;
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
    transition: transform ease .4s;
    border-radius: 29px;
    border: 2px solid #DDD;

	&::before {
		position: absolute;
		content: '${props => (props.isHours ? 'heures' : 'Jours')}';
		transform: ${props => (props.isHours ? 'translateX(29px)' : 'translateX(0px)')};
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

export default function ({unit, onBlur, onSubmit}) {
	const [isHours, setIsHours] = useState(false);
	const inputRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	});

	useOnClickOutside(containerRef, () => {
		onBlur();
	});

	return (
		<Formik
			initialValues={{
				unit,
			}}
			validationSchema={Yup.object().shape({
				unit: Yup.number().required(),
			})}
			onSubmit={async (values, actions) => {
				actions.setSubmitting(false);
				try {
					await onSubmit(parseFloat(values.unit));
				}
				catch (error) {
					actions.setSubmitting(false);
					actions.setErrors(error);
				}
			}}
		>
			{({handleSubmit, values, setFieldValue}) => (
				<form onSubmit={handleSubmit}>
					<UnitInputContainer ref={containerRef}>
						<UnitInputInput
							id="unit"
							value={values.unit}
							name="unit"
							type="number"
							ref={inputRef}
							onChange={e => setFieldValue('unit', e.target.value)
							}
						/>
						<UnitInputSwitch
							onClick={() => setIsHours(!isHours)}
						>
							<UnitInputLabel>J</UnitInputLabel>
							<UnitInputLabel>h</UnitInputLabel>
							<UnitInputSlider isHours={isHours} />
						</UnitInputSwitch>
					</UnitInputContainer>
				</form>
			)}
		</Formik>
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
