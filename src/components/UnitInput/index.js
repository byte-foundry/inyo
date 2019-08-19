import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';
import * as Yup from 'yup';

import {
	Button,
	mediumGrey,
	primaryBlack,
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
	margin-right: 5px;
	font-size: 14px;
	font-family: inherit;
	color: ${primaryBlack};
	padding-left: 0.5rem;
	text-align: center;
	background: ${mediumGrey};
	border-radius: 3px;

	${props => props.css}
`;

const UnitInputSwitch = styled('label')`
	position: relative;
	display: flex;
	padding: 5px;
	margin-right: 5px;
	font-size: 0.75rem;
	border-radius: 3px;
	border: 2px solid #ddd;
	color: ${primaryPurple};
	background-color: ${primaryWhite};
	cursor: pointer;
`;

const UnitInputLabel = styled('span')`
	padding: 0 5px;
	display: flex;
	align-items: center;
`;

const UnitInputSlider = styled('span')`
	position: absolute;
	background: ${primaryPurple};
	color: white;
	top: 1px;
	bottom: 1px;
	left: ${props => (props.isHours ? '50%' : '1px')};
	right: ${props => (props.isHours ? '1px' : '50%')};
	border-radius: 3px;
	transition: ease 0.4s;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const UnitInputForm = styled('form')`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;

let outsideClosureState;
// This is necessary becuse useOnClickOutside
// does not update the handler when state changes

const UnitInput = ({
	unit,
	onBlur,
	onSubmit,
	onTab,
	onFocus,
	innerRef,
	withButton,
	autoFocus = true,
	getValue = {},
	inputStyle = {},
}) => {
	const [isHours, setIsHours] = useState(true);
	const inputOwnRef = useRef();
	const inputRef = innerRef || inputOwnRef;
	const containerRef = useRef(null);
	const {workingTime = 8} = useUserInfos();

	outsideClosureState = isHours;

	getValue.current = () => {
		const valueFloat = parseFloat(inputRef.current.value);

		return outsideClosureState ? valueFloat / workingTime : valueFloat;
	};

	useOnClickOutside(containerRef, () => {
		const valueFloat = parseFloat(inputRef.current.value);

		if (document.activeElement === inputRef.current) onBlur(outsideClosureState ? valueFloat / workingTime : valueFloat);
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

					onSubmit(isHours ? valueFloat / workingTime : valueFloat);
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
								autoFocus={autoFocus}
								step="any"
								isHours={isHours}
								onFocus={() => {
									if (!inputRef.current) return;

									const valueFloat = parseFloat(
										inputRef.current.value,
									);

									onFocus(
										isHours
											? valueFloat / workingTime
											: valueFloat,
									);
								}}
								onChange={(e) => {
									setFieldValue('unit', e.target.value);

									if (
										document.activeElement
										!== inputRef.current
									) inputRef.current.focus();
								}}
								onKeyDown={(e) => {
									if (e.key === 'Tab') {
										onTab(
											isHours
												? e.target.value / workingTime
												: e.target.value,
										);
									}
								}}
								css={inputStyle}
							/>
						</Tooltip>
						<Tooltip label="Changer l'unité de temps">
							<UnitInputSwitch
								onClick={() => {
									inputRef.current.focus();
									setIsHours(!isHours);
								}}
							>
								<UnitInputLabel>j</UnitInputLabel>
								<UnitInputLabel>h</UnitInputLabel>
								<UnitInputSlider isHours={isHours}>
									{isHours ? 'h' : 'j'}
								</UnitInputSlider>
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
};

UnitInput.defaultProps = {
	onBlur: () => {},
	onFocus: () => {},
};

export default UnitInput;
