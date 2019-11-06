import styled from '@emotion/styled/macro';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {FlexColumn, FlexRow} from '../../utils/content';
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
import HelpAndTooltip from '../HelpAndTooltip';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';

const BudgetContainer = styled('div')`
	flex: 1;
`;

const BudgetInfoContainer = styled('div')`
	margin-bottom: 1.2rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
				{item.unit === null
					? '-'
					: `${(
						item.unit * (item.dailyRate || defaultDailyPrice)
					  ).toFixed(2)} €`}
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
	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
		(itemsSum, item) => itemsSum + item.unit * (item.dailyRate || defaultDailyPrice),
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
				<HelpAndTooltip icon="help">
					<p>
						<fbt desc="project's budget tooltip">
							Le budget vendu est la somme que vous allez facturer
							à votre client.
						</fbt>
					</p>
				</HelpAndTooltip>
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
					{props.budget === null ? (
						'—'
					) : (
						<>
							<fbt desc="budget amount">
								<fbt:param name="amount">
									{props.budget}
								</fbt:param>{' '}
								€
							</fbt>
						</>
					)}
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
	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
				<fbt desc="rentability">
					<BudgetLabel>
						Rentabilité
						<fbt:param name="budget">
							<HelpAndTooltip icon="help">
								<fbt desc="rentability tooltip">
									<p>
										La rentabilité est le ratio entre le
										budget vendu et la somme des budgets
										travaillés et budget encore prévu.
									</p>
									<p>
										Une rentabilité supérieure à 1 indique
										vous avez travaillé moins que ce que
										vous avez vendu.
									</p>
									<p>
										Une rentabilité entre 0 et 1 indique que
										vous avez travaillé plus que ce que vous
										aviez prévu.
									</p>
								</fbt>
							</HelpAndTooltip>
						</fbt:param>
					</BudgetLabel>
					<BudgetInfo>
						<fbt:param name="budget">
							{props.budget === null
								? '—'
								: (props.budget / estimatedBudget).toFixed(1)}
						</fbt:param>
					</BudgetInfo>
				</fbt>
			</BudgetInfoContainer>
		</BudgetGraphFlex>
	);

	return (
		<FlexColumn>
			<BudgetHeader>
				{props.budget !== null && <div></div>}
				<BudgetGraph
					percent={
						props.budget === null
							? 0
							: Math.max(
								0,
								1
										- (props.budget - spentBudget)
											/ props.budget,
							  )
					}
				/>
				<FlexColumn style={{flex: 1}}>
					<BudgetInfoContainer>
						<BudgetAmountAndInput {...props} />
					</BudgetInfoContainer>
					<BudgetInfoContainer>
						<fbt desc="Real budget">
							<BudgetLabel>
								Budget réel
								<fbt:param name="budget">
									<HelpAndTooltip icon="help">
										<fbt desc="Real budget tooltip">
											<p>
												Le budget réel est la somme des
												jours de travail dans votre
												projet multipliée par votre taux
												journalier moyen.
											</p>
										</fbt>
									</HelpAndTooltip>
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
						<fbt desc="remaining budget">
							<BudgetLabel>
								Budget restant
								<fbt:param name="budget">
									<HelpAndTooltip icon="help">
										<fbt desc="remaining budget tooltip">
											<p>
												Le budget restant correspond à
												la différence du montant du
												travail déjà effectué et le
												budget que vous avez vendu à
												votre client.
											</p>
										</fbt>
									</HelpAndTooltip>
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
						<fbt desc="amount to amend">
							<BudgetLabel>
								Avenant à facturer
								<fbt:param name="budget">
									<HelpAndTooltip icon="help">
										<fbt desc="Amount to amend tooltip">
											<p>
												L'avenant à facturer est la
												différence entre le budget vendu
												et le budget réel. Il correspond
												à l'excédent de travail que vous
												allez fournir.
											</p>
										</fbt>
									</HelpAndTooltip>
								</fbt:param>
							</BudgetLabel>
							<BudgetInfo>
								<fbt:param name="amendment">
									{amendment}
								</fbt:param>{' '}
								€
							</BudgetInfo>
						</fbt>
					</BudgetInfoContainer>
				</FlexColumn>
			</BudgetHeader>
			<BudgetSections>
				<FlexRowHeader>
					<div>
						<fbt desc="project milestones">Phases du projet</fbt>
					</div>
					<div>
						<fbt desc="Worked">Travaillé</fbt>
					</div>
					<div>
						<fbt desc="Planned">Planifié</fbt>
					</div>
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
	const {data, loading, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
	});
	const {defaultDailyPrice} = useUserInfos();

	if (loading) return false;

	if (error) throw error;

	const {project} = data;

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
							<BudgetDisplay
								{...props}
								budget={project.budget}
								sections={project.sections}
								defaultDailyPrice={defaultDailyPrice}
								editing={editing}
								setEditing={setEditing}
							/>
						</form>
					);
				}}
			</Formik>
		</BudgetContainer>
	);
};

export default ProjectBudget;
