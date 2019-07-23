import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';
import * as Yup from 'yup';

import {
	Button,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import useUserInfos from '../../utils/useUserInfos';
import Tooltip from '../Tooltip';

const UnitInputContainer = styled('div')`
	display: flex;
	position: relative;
`;

const UnitInputInput = styled('input')`
	width: 50px;
	margin-right: 1rem;
	font-size: 14px;
	font-family: inherit;
	color: ${primaryPurple};
	padding-left: 1rem;
`;

const UnitInputSwitch = styled('label')`
	position: relative;
	top: 0.45rem;
	right: 1.2rem;
	display: inline-block;
	width: 100px;
	height: 29px;
	cursor: pointer;
	transform: scale(0.8);
	margin-top: -0.85rem;
`;

const UnitInputLabel = styled('span')`
	position: absolute;
	top: 26%;
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
    right: -7px;
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
		font-weight: 500;
		letter-spacing: .05rem;
		transition: .4s;
		border-radius: 16px;
		padding: 0 .8rem;
		z-index: 2;
	}
`;

const UnitInputForm = styled('form')`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;

let outsideClosureState;
// This is necessary becuse useOnClickOutside
// does not update the handler when state changes

export default function ({
	unit,
	onBlur,
	onSubmit,
	onTab,
	innerRef,
	withButton,
	getValue = {},
}) {
	const [isHours, setIsHours] = useState(true);
	const inputRef = innerRef || useRef();
	const containerRef = useRef(null);
	const {workingTime = 8} = useUserInfos();

	outsideClosureState = isHours;

	getValue.current = () => {
		const valueFloat = parseFloat(inputRef.current.value);

		return outsideClosureState ? valueFloat / workingTime : valueFloat;
	};

	useEffect(() => {
		inputRef.current.focus();
	});

	useOnClickOutside(containerRef, () => {
		const valueFloat = parseFloat(inputRef.current.value);

		onBlur(outsideClosureState ? valueFloat / workingTime : valueFloat);
	});

	return (
		<Formik
			initialValues={{
				unit: isHours ? unit * workingTime : unit,
			}}
			validationSchema={Yup.object().shape({
				unit: Yup.number().required(),
			})}
			onSubmit={(values, actions) => {
				actions.setSubmitting(false);
				try {
					const valueFloat = parseFloat(values.unit);

					onSubmit(isHours ? valueFloat / 8 : valueFloat);
				}
				catch (error) {
					actions.setSubmitting(false);
					actions.setErrors(error);
				}
			}}
		>
			{({handleSubmit, values, setFieldValue}) => (
				<UnitInputForm onSubmit={handleSubmit} novalidate>
					<UnitInputContainer ref={containerRef}>
						<Tooltip label="Durée de la tâche">
							<UnitInputInput
								id="unit"
								value={values.unit}
								name="unit"
								type="number"
								ref={inputRef}
								step="any"
								isHours={isHours}
								onChange={e => setFieldValue('unit', e.target.value)
								}
								onKeyDown={(e) => {
									if (e.key === 'Tab') {
										onTab(e.target.value);
									}
								}}
							/>
						</Tooltip>
						<Tooltip label="Changer l'unité de temps">
							<UnitInputSwitch
								onClick={() => {
									setIsHours(!isHours);
								}}
							>
								<UnitInputLabel>J</UnitInputLabel>
								<UnitInputLabel>h</UnitInputLabel>
								<UnitInputSlider isHours={isHours} />
							</UnitInputSwitch>
						</Tooltip>
					</UnitInputContainer>
					{withButton && (
						<Tooltip label="Valider le temps et marquer comme fait">
							<Button textIcon tiny type="submit">
								✓
							</Button>
						</Tooltip>
					)}
				</UnitInputForm>
			)}
		</Formik>
	);
}
