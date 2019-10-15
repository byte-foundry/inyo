import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {FlexColumn, FlexRow} from '../../utils/content';
import {UPDATE_PROJECT} from '../../utils/mutations';
import {
	Button,
	primaryBlack,
	primaryGrey,
	primaryPurple,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import useUserInfos from '../../utils/useUserInfos';
import FormElem from '../FormElem';

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
`;

const BudgetInfo = styled('div')`
	font-size: 1.4rem;
	color: ${primaryGrey};
`;

const BudgetGraphFlex = styled(FlexColumn)`
	flex: 1;
	align-items: center;
`;

const BudgetGraphContainer = styled('div')`
	position: relative;
	width: 300px;
	height: 100%;
`;

const BudgetGraphBaseline = styled('div')`
	width: 300px;
	position: absolute;
	border-top: solid 1px black;
	bottom: 0px;
`;

const BudgetGraphBudget = styled('div')`
	width: 200px;
	position: absolute;
	height: 100%;
	border: solid 1px black;
	box-sizing: border-box;
	bottom: 0px;
	left: 50px;
`;

const BudgetGraphSpent = styled('div')`
	background-color: ${primaryPurple};
	width: 200px;
	position: absolute;
	position: absolute;
	height: 50%;
	bottom: 0px;
	left: 50px;
`;

const BudgetGraphHalf = styled('div')`
	width: 250px;
	position: absolute;
	border-top: dashed 1px black;
	top: 50%;
	left: 25px;
`;

const BudgetGraph = () => (
	<BudgetGraphFlex>
		<BudgetGraphContainer>
			<BudgetGraphBudget></BudgetGraphBudget>
			<BudgetGraphSpent></BudgetGraphSpent>
			<BudgetGraphBaseline></BudgetGraphBaseline>
			<BudgetGraphHalf></BudgetGraphHalf>
		</BudgetGraphContainer>
	</BudgetGraphFlex>
);

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
		<FlexRow>
			<BudgetGraph budget={props.values.budget} sections={sections} />
			<FlexColumn style={{flex: 1}}>
				<BudgetInfoContainer>
					<fbt desc="project's budget">
						<BudgetLabel>Budget du projet</BudgetLabel>
						<BudgetInfo>
							<fbt:param name="budget">
								{props.values.budget}
							</fbt:param>{' '}
							€
						</BudgetInfo>
					</fbt>
				</BudgetInfoContainer>
				<BudgetInfoContainer>
					<fbt desc="project's budget">
						<BudgetLabel>Budget restant</BudgetLabel>
						<BudgetInfo>
							<fbt:param name="budget">
								{Math.round(props.values.budget - spentBudget)}
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
								{props.values.budget}
							</fbt:param>{' '}
							€
						</BudgetInfo>
					</fbt>
				</BudgetInfoContainer>
			</FlexColumn>
		</FlexRow>
	);
};

const NoBudgetDisplay = props => (
	<div>
		<fbt desc="No project Budget">
			<div>Vous n'avez pas encore mis de budget pour ce projet.</div>
			<div>Entrez un budget pour ce projet</div>
		</fbt>
		<FormElem
			{...props}
			name="budget"
			type="number"
			placeholder={<fbt desc="budget placeholder">5000 €</fbt>}
		/>
		<Button onClick={props.onSubmit} disabled={props.isSubmitting}>
			<fbt desc="No project Budget">Valider</fbt>
		</Button>
	</div>
);

const ProjectBudget = ({projectId}) => {
	const [updateProject] = useMutation(UPDATE_PROJECT);
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId},
		suspend: true,
	});
	const {defaultDailyPrice} = useUserInfos();

	if (error) throw error;

	const {project} = data;
	const projectHasBudget = data.project.budget !== null;

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
						await updateProject({
							variables: {
								projectId,
								budget: Number.parseFloat(values.budget),
							},
							optimisticResponse: {
								updateProject: {
									projectId,
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
							{projectHasBudget ? (
								<BudgetDisplay
									{...props}
									sections={project.sections}
									defaultDailyPrice={defaultDailyPrice}
								/>
							) : (
								<NoBudgetDisplay {...props} />
							)}
						</form>
					);
				}}
			</Formik>
		</BudgetContainer>
	);
};

export default ProjectBudget;
