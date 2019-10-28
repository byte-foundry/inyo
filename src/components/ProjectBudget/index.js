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
	accentGrey,
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
import MaterialIcon from '../MaterialIcon';

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
	margin-right: 2rem;
`;

const BudgetGraph = ({percent}) => (
	<BudgetGraphFlex>
		<Pie big value={percent} />
	</BudgetGraphFlex>
);

const BudgetItemRow = styled(FlexRow)`
	color: ${({finished}) => (finished ? primaryPurple : primaryBlack)};
	padding-left: 2.5rem;

	font-size: 1rem;

	display: grid;
	grid-template-columns: 2.5rem 1fr 240px;

	${TaskIcon} {
		transform: scale(0.75);
	}
`;

const FlexRowHeader = styled(FlexRow)`
	display: grid;
	grid-template-columns: 1fr 120px 120px;
	padding: 1.5rem 0.5rem;

	color: ${accentGrey};
	font-size: 1rem;
`;

const FlexRowSection = styled(FlexRow)`
	display: grid;
	grid-template-columns: 1fr 120px 120px;

	font-size: 1.2rem;
`;

const BudgetItemName = styled('div')`
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const BudgetItemBudget = styled('div')`
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
	margin-bottom: ${({open}) => (open ? '2rem' : '0')};
`;

const BudgetSectionName = styled('div')`
	flex: 1;
	display: flex;

	i {
		margin-right: 0.5rem;
	}
`;

const BudgetSectionBudget = styled('div')``;

const BudgetSectionContainer = styled(FlexColumn)`
	padding: 0.5rem;
	padding-left: 0;
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
			<FlexRowSection>
				<BudgetSectionName>
					<MaterialIcon
						size="medium"
						icon={open ? 'arrow_drop_down' : 'arrow_right'}
					/>
					{section.name}
				</BudgetSectionName>
				<BudgetSectionBudget>
					{sectionBudgetWorked} €
				</BudgetSectionBudget>
				<BudgetSectionBudget>
					{sectionBudgetUnworked} €
				</BudgetSectionBudget>
			</FlexRowSection>
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
						<fbt:param name="amount">{props.budget}</fbt:param> €
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
				<FlexRowHeader>
					<div>Phases du projet</div>
					<div>Travaillé</div>
					<div>Restant</div>
				</FlexRowHeader>
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
					label={<fbt desc="budget label">Budget vendu</fbt>}
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
