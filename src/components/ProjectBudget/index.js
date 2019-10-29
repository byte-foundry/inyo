import styled from '@emotion/styled/macro';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
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
	margin-bottom: 1.2rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-bottom: 0.2rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
`;

const BudgetLabel = styled('div')`
	font-size: 1.2rem;
	color: ${primaryBlack};
	font-weight: 500;
	display: flex;
`;

const BudgetInfo = styled('div')`
	font-size: 1.4rem;
	color: ${primaryGrey};

	display: flex;
	flex-direction: row;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: row-reverse;
	}
`;

const BudgetGraphFlex = styled(FlexColumn)`
	margin-right: 4rem;
	align-items: center;
	justify-content: center;

	${BudgetInfoContainer} {
		margin: 0;
		position: absolute;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 1rem 0 3rem;

		${BudgetInfoContainer} {
			flex-direction: column;
		}
	}
`;

const BudgetItemRow = styled(FlexRow)`
	color: ${({finished}) => (finished ? primaryPurple : primaryBlack)};
	padding-left: 2.5rem;
	margin-top: 0.2rem;

	font-size: 1rem;

	display: grid;
	grid-template-columns: 2.5rem 1fr 120px 120px;

	${TaskIcon} {
		width: 2rem;
		height: 2rem;
		transform: scale(0.75);
		margin: 0;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;

		${TaskIcon} {
			left: 1rem;
		}
	}
`;

const FlexRowHeader = styled(FlexRow)`
	display: grid;
	grid-template-columns: 1fr 120px 120px;
	padding: 1.5rem 0.5rem;

	color: ${accentGrey};
	font-size: 1rem;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		justify-content: flex-end;

		div:first-child {
			display: none;
		}

		div:last-child {
			&::before {
				content: '/';
			}
		}
	}
`;

const FlexRowSection = styled(FlexRow)`
	display: grid;
	grid-template-columns: 1fr 120px 120px;

	font-size: 1.2rem;

	@media (max-width: ${BREAKPOINTS}px) {
		grid-template-columns: 1fr 40px 40px;
	}
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
	const budget = Math.round(
		(item.timeItTook || item.unit) * (item.dailyRate || defaultDailyPrice),
	);

	return (
		<BudgetItemRow finished={item.status === 'FINISHED'}>
			<TaskIcon noAnim status={item.status} type={item.type} />
			<BudgetItemName>{item.name}</BudgetItemName>
			<BudgetItemBudget>
				{item.status === 'FINISHED' ? `${budget} €` : '-'}
			</BudgetItemBudget>
			<BudgetItemBudget>
				{item.status === 'FINISHED' ? '-' : `${budget} €`}
			</BudgetItemBudget>
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

const BudgetSectionBudget = styled('div')`
	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 0.7rem;
	}
`;

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
					{Math.round(sectionBudgetWorked)} €
				</BudgetSectionBudget>
				<BudgetSectionBudget>
					{Math.round(sectionBudgetUnworked)} €
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
			Budget vendu
			<fbt:param name="budget">
				<IconButton icon="help" size="tiny" color={accentGrey} />
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
					<EditBudgetButton
						onClick={() => setEditing(!editing)}
						icon="edit"
						size="tiny"
					/>
				</BudgetInfo>
			)}
		</fbt:param>
	</fbt>
);

const BudgetSections = styled('div')`
	margin-top: 2rem;
`;

const BudgetHeader = styled(FlexRow)`
	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
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

	const estimatedBudget = sections.reduce(
		(sectionsSum, section) => sectionsSum
			+ section.items.reduce(
				(itemsSum, item) => itemsSum
					+ (item.timeItTook || item.unit)
						* (item.dailyRate || defaultDailyPrice),
				0,
			),
		0,
	);

	const amendment
		= Math.round(props.budget - estimatedBudget) < 0
			? Math.round(-Math.round(props.budget - estimatedBudget))
			: '-';

	const BudgetGraph = ({percent}) => (
		<BudgetGraphFlex>
			<Pie big value={percent} />
			<BudgetInfoContainer>
				<fbt desc="project's budget">
					<BudgetLabel>
						Rentabilité
						<fbt:param name="budget">
							<IconButton
								icon="help"
								size="tiny"
								color={accentGrey}
							/>
						</fbt:param>
					</BudgetLabel>
					<BudgetInfo>
						<fbt:param name="budget">
							{(props.budget / estimatedBudget).toFixed(1)}
						</fbt:param>
					</BudgetInfo>
				</fbt>
			</BudgetInfoContainer>
		</BudgetGraphFlex>
	);

	return (
		<FlexColumn>
			<BudgetHeader>
				<BudgetGraph
					percent={Math.max(
						0,
						1 - (props.budget - spentBudget) / props.budget,
					)}
				/>
				<FlexColumn style={{flex: 1}}>
					<BudgetInfoContainer>
						<BudgetAmountAndInput {...props} />
					</BudgetInfoContainer>
					<BudgetInfoContainer>
						<fbt desc="project's budget">
							<BudgetLabel>
								Budget réel
								<fbt:param name="budget">
									<IconButton
										icon="help"
										size="tiny"
										color={accentGrey}
									/>
								</fbt:param>
							</BudgetLabel>
							<BudgetInfo>
								<fbt:param name="budget">
									{Math.round(estimatedBudget)}
								</fbt:param>
								{' '}€
							</BudgetInfo>
						</fbt>
					</BudgetInfoContainer>
					<BudgetInfoContainer>
						<fbt desc="project's budget">
							<BudgetLabel>
								Budget restant
								<fbt:param name="budget">
									<IconButton
										icon="help"
										size="tiny"
										color={accentGrey}
									/>
								</fbt:param>
							</BudgetLabel>
							<BudgetInfo>
								<fbt:param name="budget">
									{Math.round(props.budget - spentBudget)}
								</fbt:param>
								{' '}€
							</BudgetInfo>
						</fbt>
					</BudgetInfoContainer>
					<BudgetInfoContainer>
						<fbt desc="project's budget">
							<BudgetLabel>
								Avenant à facturer
								<fbt:param name="budget">
									<IconButton
										icon="help"
										size="tiny"
										color={accentGrey}
									/>
								</fbt:param>
							</BudgetLabel>
							<fbt:param name="amendment">
								<BudgetInfo>{amendment} €</BudgetInfo>
							</fbt:param>
						</fbt>
					</BudgetInfoContainer>
				</FlexColumn>
			</BudgetHeader>
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
						Vous n'avez pas encore défini de budget pour ce projet.
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
					budget.
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
									Un problème s'est produit
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
