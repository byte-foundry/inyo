import styled from "@emotion/styled";
import moment from "moment";
import React, { useRef, useState } from "react";

import fbt from "../../fbt/fbt.macro";
import { useQuery } from "../../utils/apollo-hooks";
import { BREAKPOINTS } from "../../utils/constants";
import { ModalActions } from "../../utils/content";
import { formatName } from "../../utils/functions";
import {
	Button,
	Input,
	InputLabel,
	Label,
	SubHeading
} from "../../utils/new/design-system";
import { templates } from "../../utils/project-templates";
import { GET_ALL_CUSTOMERS } from "../../utils/queries";
import useOnClickOutside from "../../utils/useOnClickOutside";
import useUserInfos from "../../utils/useUserInfos";
import DateInput from "../DateInput";
import FormElem from "../FormElem";
import FormSelect from "../FormSelect";
import Icon from "../MaterialIcon";
import Tooltip from "../Tooltip";

const FormSubHeading = styled(SubHeading)`
	grid-column: 1 / 4;
`;

const CreateProjectRow = styled("div")`
	margin-top: 1rem;
	grid-column-end: span 3;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: block;
	}
`;

const CreateProjectGrid = styled("form")`
	display: grid;
	grid-template-columns: 400px 1fr 1fr;
	grid-row-gap: 1.5rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex-direction: column;
	}
`;

const DeadlineInput = styled(Input.withComponent("div"))`
	height: 40px;
	display: flex;
	align-items: center;
	position: relative;
`;

const DeadlineInputContent = styled("p")`
	flex: 1;
	cursor: pointer;
`;

const Option = styled("div")`
	${props => props.style}
`;

const createPreviewableOption = ({ onHover }) => {
	const PreviewableOption = props => {
		const {
			children,
			className,
			cx,
			getStyles,
			isDisabled,
			isFocused,
			isSelected,
			innerRef,
			innerProps,
			data
		} = props;

		return (
			<Option
				style={getStyles("option", props)}
				className={cx(
					{
						option: true,
						"option--is-disabled": isDisabled,
						"option--is-focused": isFocused,
						"option--is-selected": isSelected
					},
					className
				)}
				ref={innerRef}
				{...innerProps}
				onMouseOver={() => onHover(data)}
			>
				{children}
			</Option>
		);
	};

	return PreviewableOption;
};

export default function({
	optionsProjects,
	setViewContent,
	setCreateCustomer,
	setCustomerName,
	onDismiss,
	isSubmitting,
	...props
}) {
	const { language } = useUserInfos();
	const [editDeadline, setEditDeadline] = useState(false);
	const { data: dataCustomers } = useQuery(GET_ALL_CUSTOMERS, {
		suspend: true
	});

	const templateOptions = [
		{
			label: (
				<fbt project="inyo" desc="empty project">
					Projet vierge
				</fbt>
			),
			value: "EMPTY"
		},
		{
			label: (
				<fbt project="inyo" desc="your projects">
					Vos projets
				</fbt>
			),
			options: optionsProjects
		},
		{
			label: (
				<fbt project="inyo" desc="our templates">
					Nos modèles
				</fbt>
			),
			options: templates[language].map(template => ({
				value: template.name,
				label: template.label
			}))
		}
	];

	let optionsCustomers = [];

	optionsCustomers = dataCustomers.me.customers.map(customer => ({
		value: customer.id,
		label: `${customer.name} (${formatName(
			customer.firstName,
			customer.lastName
		)})`
	}));

	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setEditDeadline(false);
	});

	return (
		<CreateProjectGrid>
			<FormSubHeading>Créer un nouveau projet</FormSubHeading>
			<CreateProjectRow>
				<FormElem
					{...props}
					name="name"
					type="text"
					label={
						<fbt project="inyo" desc="project name label">
							Titre du projet
						</fbt>
					}
					placeholder={
						<fbt project="inyo" desc="new project name placeholder">
							Ex: Landing page nouvelle collection, etc.
						</fbt>
					}
					big
					noMarginBottom
				/>
			</CreateProjectRow>
			<CreateProjectRow>
				<FormSelect
					{...props}
					name="template"
					label={
						<fbt project="inyo" desc="template select">
							Modèle
						</fbt>
					}
					big
					classNamePrefix="intercom-tour"
					options={templateOptions}
					onChange={option => {
						setViewContent(option.value);
					}}
					components={{
						Option: createPreviewableOption({
							onHover: option =>
								option &&
								option.value &&
								option.value !== "EMPTY" &&
								setViewContent(option.value)
						})
					}}
				/>
			</CreateProjectRow>
			<CreateProjectRow>
				<FormSelect
					{...props}
					onChange={(option, { action }) => {
						if (
							action === "select-option" &&
							option &&
							option.value === "CREATE"
						) {
							setCreateCustomer(true);
						}
					}}
					onInputChange={(value, { action }) => {
						if (action === "input-change") {
							setCustomerName(value);
						}
					}}
					handleBlur={() => {}}
					options={[
						{
							label: (
								<fbt project="inyo" desc="create a new client">
									Créer un nouveau client
								</fbt>
							),
							value: "CREATE"
						},
						...optionsCustomers
					]}
					name="customerId"
					label={
						<fbt project="inyo" desc="main customer of the project">
							Client principal du projet
						</fbt>
					}
					big
				/>
			</CreateProjectRow>
			<CreateProjectRow>
				<FormElem
					{...props}
					name="budget"
					type="number"
					label={
						<fbt project="inyo" desc="project name label">
							Budget
						</fbt>
					}
					placeholder={
						<fbt project="inyo" desc="new project name placeholder">
							5000 €
						</fbt>
					}
					big
					noMarginBottom
				/>
			</CreateProjectRow>
			<CreateProjectRow>
				<InputLabel>
					<Label>Deadline</Label>
					<DeadlineInput>
						<Tooltip
							label={
								<fbt
									project="inyo"
									desc="create project deadline"
								>
									Date limite du projet
								</fbt>
							}
						>
							<DeadlineInputContent
								onClick={() => setEditDeadline(true)}
							>
								{(props.values.deadline &&
									moment(props.values.deadline).format(
										"DD/MM/YYYY"
									)) || (
									<fbt project="inyo" desc="no deadline">
										Aucune date limite
									</fbt>
								)}
							</DeadlineInputContent>
						</Tooltip>
						{editDeadline && (
							<DateInput
								innerRef={dateRef}
								date={moment(
									props.values.deadline || new Date()
								)}
								onDateChange={date => {
									props.setFieldValue(
										"deadline",
										date.toISOString()
									);
									setEditDeadline(false);
								}}
								duration={0}
								position="left"
							/>
						)}
						<Icon icon="event" size="tiny" />
					</DeadlineInput>
				</InputLabel>
			</CreateProjectRow>
			<ModalActions>
				<Button link onClick={onDismiss} disabled={isSubmitting}>
					<fbt project="inyo" desc="cancel create project">
						Annuler
					</fbt>
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					<fbt project="inyo" desc="confirm create project">
						Créer le projet
					</fbt>
				</Button>
			</ModalActions>
		</CreateProjectGrid>
	);
}
