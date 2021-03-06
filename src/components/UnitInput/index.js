import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {useCallback, useRef, useState} from 'react';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {
	Button,
	mediumGrey,
	primaryBlack,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import useOnClickOutside from '../../utils/useOnClickOutside';
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
	onChange = () => {},
}) => {
	const [isHours, setIsHours] = useState(unit < 1);
	const inputOwnRef = useRef();
	const inputRef = innerRef || inputOwnRef;
	const containerRef = useRef(null);
	const {workingTime = 8} = useUserInfos();

	getValue.current = () => {
		const valueFloat = parseFloat(inputRef.current.value);

		return isHours ? valueFloat / workingTime : valueFloat;
	};

	const blurCallback = useCallback(() => {
		const valueFloat = parseFloat(inputRef.current.value);

		if (document.activeElement === inputRef.current) onBlur(isHours ? valueFloat / workingTime : valueFloat);
	}, [inputRef, isHours, onBlur, workingTime]);

	useOnClickOutside(containerRef, blurCallback);

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
						<Tooltip
							label={
								<fbt project="inyo" desc="task duration">
									Durée de la tâche
								</fbt>
							}
						>
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

									const valueFloat = parseFloat(
										e.target.value,
									);

									onChange(
										isHours
											? valueFloat / workingTime
											: valueFloat,
									);

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
								css={(() => {
									if (
										typeof inputStyle === 'function'
										&& inputRef.current
									) {
										return inputStyle({
											inputValue: parseFloat(
												inputRef.current.value,
											),
											isHours,
										});
									}

									return inputStyle;
								})()}
							/>
						</Tooltip>
						<Tooltip
							label={
								<fbt project="inyo" desc="change time unit">
									Changer l'unité de temps
								</fbt>
							}
						>
							<UnitInputSwitch
								onClick={() => {
									inputRef.current.focus();
									setIsHours(!isHours);
								}}
							>
								<UnitInputLabel>
									<fbt project="inyo" desc="day supershort">
										j
									</fbt>
								</UnitInputLabel>
								<UnitInputLabel>h</UnitInputLabel>
								<UnitInputSlider isHours={isHours}>
									{isHours ? (
										'h'
									) : (
										<fbt
											project="inyo"
											desc="day supershort"
										>
											j
										</fbt>
									)}
								</UnitInputSlider>
							</UnitInputSwitch>
						</Tooltip>
					</UnitInputContainer>
					{withButton && (
						<Tooltip
							label={
								<fbt
									project="inyo"
									desc="confirm task duration"
								>
									Valider le temps et marquer comme fait
								</fbt>
							}
						>
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
