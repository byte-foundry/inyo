import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {FlexColumn, FlexRow} from '../../utils/content';
import {clamp} from '../../utils/functions';
import {UPDATE_PROJECT} from '../../utils/mutations';
import {
	Button,
	lightGrey,
	Pie,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	TaskIcon,
} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';
import useUserInfos from '../../utils/useUserInfos';
import FormElem from '../FormElem';
import IconButton from '../IconButton';

const BudgetContainer = styled('div')`
	flex: 1;
`;

const BudgetInfoContainer = styled('div')`
	margin-bottom: 2rem;
`;

const BudgetLabel = styled('div')`
	font-size: 1.6rem;
	color: ${primaryBlack};
	font-weight: 500;
	display: flex;
`;

const BudgetInfo = styled('div')`
	font-size: 1.4rem;
	color: ${primaryGrey};
`;

const BudgetGraphFlex = styled(FlexColumn)`
	flex: 0 0 350px;
	align-items: center;
`;

const BudgetGraph = ({percent}) => (
	<BudgetGraphFlex>
		<Pie big value={percent} />
	</BudgetGraphFlex>
);

const BudgetItemRow = styled(FlexRow)`
	color: ${({finished}) => (finished ? primaryPurple : primaryBlack)};
`;

const BudgetItemName = styled('div')`
	flex: 1;
	font-size: 1.2rem;
	height: 56px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const BudgetItemBudget = styled('div')`
	font-size: 1.2rem;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const BudgetItem = ({item, defaultDailyPrice}) => {
	const budget
		= (item.timeItTook || item.unit) * (item.dailyRate || defaultDailyPrice);

	return (
		<BudgetItemRow finished={item.status === 'FINISHED'}>
			<TaskIcon noAnim status={item.status} type={item.type} />
			<BudgetItemName>{item.name}</BudgetItemName>
			<BudgetItemBudget>{budget} €</BudgetItemBudget>
		</BudgetItemRow>
	);
};

const BudgetItems = styled('div')`
	display: ${({open}) => (open ? 'block' : 'none')};
`;

const BudgetSectionName = styled('div')`
	font-size: 1.5rem;
	flex: 1;
`;

const BudgetSectionBudget = styled('div')`
	font-size: 1.5rem;
	margin-left: 1rem;
`;

const BudgetSectionContainer = styled(FlexColumn)`
	padding: 0.5rem;
	border-radius: 3px;
	cursor: pointer;

	&:hover {
		background: ${lightGrey};
	}
`;

const BudgetSection = ({section, defaultDailyPrice}) => {
	const [open, setOpen] = useState(false);
	const sectionBudgetUnworked = section.items.reduce(
		(itemsSum, item) => itemsSum
			+ (item.status !== 'FINISHED'
				? (item.timeItTook || item.unit)
				  * (item.dailyRate || defaultDailyPrice)
				: 0),
		0,
	);

	const sectionBudgetWorked = section.items.reduce(
		(itemsSum, item) => itemsSum
			+ (item.status === 'FINISHED'
				? (item.timeItTook || item.unit)
				  * (item.dailyRate || defaultDailyPrice)
				: 0),
		0,
	);

	return (
		<BudgetSectionContainer onClick={() => setOpen(!open)}>
			<FlexRow>
				<BudgetSectionName>{section.name}</BudgetSectionName>
				<BudgetSectionBudget>
					Travaillé {sectionBudgetWorked} €
				</BudgetSectionBudget>
				<BudgetSectionBudget>
					Restant {sectionBudgetUnworked} €
				</BudgetSectionBudget>
			</FlexRow>
			<BudgetItems open={open}>
				{section.items.map(item => (
					<BudgetItem
						item={item}
						defaultDailyPrice={defaultDailyPrice}
					/>
				))}
			</BudgetItems>
		</BudgetSectionContainer>
	);
};

const EditBudgetButton = styled(IconButton)`
	width: 2.4rem;
	height: 2.4rem;
	margin-left: 0.5rem;
`;

const BudgetFormContainer = styled('div')`
	display: flex;
	width: 60%;
`;

const BudgetFormElem = styled(FormElem)`
	margin-bottom: 0px;
	margin-right: 1rem;
`;

const BudgetAmountAndInput = ({editing, setEditing, ...props}) => (
	<fbt desc="project's budget">
		<BudgetLabel>
				Budget du projet
			<fbt:param name="icon">
				<EditBudgetButton
					onClick={() => setEditing(!editing)}
					icon="edit"
					size="tiny"
				/>
			</fbt:param>
		</BudgetLabel>
		<fbt:param name="input">
			{editing ? (
				<BudgetFormContainer>
					<BudgetFormElem
						name="budget"
						type="number"
						big
						{...props}
					/>
					<Button type="submit">
						<fbt desc="confirm">Valider</fbt>
					</Button>
				</BudgetFormContainer>
			) : (
				<BudgetInfo>
					<fbt desc="budget amount">
						<fbt:param name="amount">{props.budget}</fbt:param>{' '}
							€
					</fbt>
				</BudgetInfo>
			)}
		</fbt:param>
	</fbt>
);

const BudgetSections = styled('div')`
	margin-top: 2rem;
`;

const BudgetDisplay = ({sections, defaultDailyPrice, ...props}) => {
	const spentBudget = sections.reduce(
		(sectionsSum, section) => sectionsSum
			+ section.items.reduce(
				(itemsSum, item) => itemsSum
					+ (item.status === 'FINISHED'
						? (item.timeItTook || item.unit)
						  * (item.dailyRate || defaultDailyPrice)
						: 0),
				0,
			),
		0,
	);

	return (
		<FlexColumn>
			<FlexRow>
				<BudgetGraph
					percent={Math.max(0, spentBudget / props.budget)}
				/>
				<FlexColumn style={{flex: 1}}>
					<BudgetInfoContainer>
						<BudgetAmountAndInput {...props} />
					</BudgetInfoContainer>
					<BudgetInfoContainer>
						<fbt desc="project's budget">
							<BudgetLabel>Budget restant</BudgetLabel>
							<BudgetInfo>
								<fbt:param name="budget">
									{Math.round(props.budget - spentBudget)}
								</fbt:param>{' '}
								€
							</BudgetInfo>
						</fbt>
					</BudgetInfoContainer>
					<BudgetInfoContainer>
						<fbt desc="project's budget">
							<BudgetLabel>Rentabilité</BudgetLabel>
							<BudgetInfo>
								<fbt:param name="budget">
									{(spentBudget / props.budget).toFixed(1)}
								</fbt:param>{' '}
							</BudgetInfo>
						</fbt>
					</BudgetInfoContainer>
				</FlexColumn>
			</FlexRow>
			<BudgetSections>
				{sections.map(section => (
					<BudgetSection
						section={section}
						defaultDailyPrice={defaultDailyPrice}
					/>
				))}
			</BudgetSections>
		</FlexColumn>
	);
};

const NoBudgetDisplay = ({projectHasBudget, userHasDailyRate, ...props}) => (
	<div>
		{!projectHasBudget && (
			<>
				<fbt desc="No project Budget">
					<BudgetLabel>
						Vous n'avez pas encore mis de budget pour ce projet.
					</BudgetLabel>
				</fbt>
				<FormElem
					label={<fbt desc="budget label">Budget du projet</fbt>}
					{...props}
					name="budget"
					type="number"
					placeholder={<fbt desc="budget placeholder">5000 €</fbt>}
				/>
				<Button
					onClick={props.onSubmit}
					type="submit"
					disabled={props.isSubmitting}
				>
					<fbt desc="No project Budget">Valider</fbt>
				</Button>
			</>
		)}
		{!userHasDailyRate && (
			<fbt desc="defined a daily rate">
				<Link to="/app/account#settings">
					Définissez votre TJM pour profiter des fonctionnalités de
					budget
				</Link>
			</fbt>
		)}
	</div>
);

const ProjectBudget = ({projectId}) => {
	const [editing, setEditing] = useState(false);
	const [updateProject] = useMutation(UPDATE_PROJECT);
	const {data, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});
	const {defaultDailyPrice} = useUserInfos();

	if (error) throw error;

	const {project} = data;
	const projectHasBudget = data.project.budget !== null;
	const userHasDailyRate = defaultDailyPrice !== null;

	return (
		<BudgetContainer>
			<Formik
				initialValues={{
					budget: project.budget,
				}}
				validateSchema={Yup.object().shape({
					budget: Yup.number().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);

					try {
						setEditing(false);
						await updateProject({
							variables: {
								projectId,
								budget: Number.parseFloat(values.budget),
							},
							optimisticResponse: {
								updateProject: {
									...project,
									budget: Number.parseFloat(values.budget),
								},
							},
						});
					}
					catch (err) {
						actions.setSubmitting(false);
						actions.setErrors(err);
						actions.setStatus({
							msg: (
								<fbt project="inyo" desc="something went wrong">
									Un problème c'est produit
								</fbt>
							),
						});
					}
				}}
			>
				{(props) => {
					const {handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							{projectHasBudget || userHasDailyRate ? (
								<BudgetDisplay
									{...props}
									budget={project.budget}
									sections={project.sections}
									defaultDailyPrice={defaultDailyPrice}
									editing={editing}
									setEditing={setEditing}
								/>
							) : (
								<NoBudgetDisplay
									projectHasBudget={projectHasBudget}
									userHasDailyRate={userHasDailyRate}
									{...props}
								/>
							)}
						</form>
					);
				}}
			</Formik>
		</BudgetContainer>
	);
};

export default ProjectBudget;
