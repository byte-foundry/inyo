import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useCallback} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {VictoryPie, VictoryArea, VictoryTooltip} from 'victory';
import CalendarHeatmap from 'reactjs-calendar-heatmap';

import ArianneThread, {ArianneElem} from '../../../components/ArianneThread';
import HelpAndTooltip from '../../../components/HelpAndTooltip';
import MaterialIcon from '../../../components/MaterialIcon';
import SingleBarChart from '../../../components/SingleBarChart';
import TasksProgressBar from '../../../components/TasksProgressBar';
import Legend from '../../../components/Legend';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS, TAG_COLOR_PALETTE} from '../../../utils/constants';
import {formatName} from '../../../utils/functions';
import {
	A,
	accentGrey,
	Heading,
	mediumGrey,
	P,
	SubHeading,
	primaryPurple,
	mediumPurple,
	lightPurple
} from '../../../utils/new/design-system';
import {GET_ALL_TASKS_STATS, GET_USER_TAGS} from '../../../utils/queries';
import useUserInfos from '../../../utils/useUserInfos';
import Tag from '../../../components/Tag';

const Container = styled('div')`
	width: 980px;
	margin: 3.5rem auto;
	min-height: 100vh;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		max-width: 100%;
	}
`;

const Cards = styled('div')`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 20px;
	grid-row-gap: 20px;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		grid-template-columns: 1fr;
	}
`;

const Card = styled('div')`
	background-color: ${lightPurple};
	border-radius: 8px;
	padding: 1rem;
	min-height: 200px;
	position: relative;
	overflow: hidden;
`;

const Number = styled(P)`
	font-size: 2.3rem;
	font-weight: 500;
	margin: 0;
	position: relative;
`;

const TimeSelectContainer = styled('div')`
	display: flex;
	align-items: center;
	width: 200px;
`;

const TimeSelect = styled(ArianneElem)`
	margin-left: 5px;
	width: 100%;
`;

const MetaHeading = styled('div')`
	display: flex;
	align-items: center;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
		align-items: start;
	}
`;

const PageSubHeading = styled(SubHeading)`
	margin: 2rem 0;
`;

const Section = styled('div')`
	margin-bottom: 5rem;
`;

const PiesWrapper = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const PieWrapper = styled('div')`
	display: grid;
	grid-template-columns: 1fr 200px;
	align-items: center;
`;

const Stats = ({history, location}) => {
	const {
		data: {
			me: {id, tasks}
		},
		error
	} = useQuery(GET_ALL_TASKS_STATS, {suspend: true});
	const {workingTime = 8, defaultDailyPrice = 0, clientViews, language} =
		useUserInfos() || {};

	// console.log("here");
	// console.log(clientViews);

	const query = new URLSearchParams(location.search);

	const since = parseInt(query.get('since'), 10) || 30;
	const projectId = query.get('projectId');
	const tags = query.getAll('tags');
	const linkedCustomerId = query.get('customerId');

	if (error) throw error;

	const setSince = useCallback(
		value => {
			const newQuery = new URLSearchParams(query);

			newQuery.set('since', value);

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query]
	);

	const setProjectSelected = useCallback(
		(selected, removeCustomer) => {
			const newQuery = new URLSearchParams(query);

			if (selected) {
				const {value: selectedProjectId} = selected;

				newQuery.set('projectId', selectedProjectId);
			} else if (newQuery.has('projectId')) {
				newQuery.delete('projectId');
			}

			if (removeCustomer) {
				newQuery.delete('customerId');
			}

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query, history]
	);

	const setCustomerSelected = useCallback(
		selected => {
			const newQuery = new URLSearchParams(query);

			if (selected) {
				const {value: selectedCustomerId} = selected;

				newQuery.set('customerId', selectedCustomerId);
			} else if (newQuery.has('customerId')) {
				newQuery.delete('customerId');
			}

			if (newQuery.has('projectId')) {
				newQuery.delete('projectId');
			}

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query, history]
	);

	const setTagSelected = useCallback(
		selected => {
			const newQuery = new URLSearchParams(query);

			if (selected) {
				newQuery.delete('tags');
				selected.forEach(tag => newQuery.append('tags', tag.value));
			}

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query, history]
	);

	const filteredTasks = tasks.filter(
		task =>
			moment(task.createdAt).isSameOrAfter(
				moment().subtract(since, 'days')
			) &&
			(!linkedCustomerId ||
				((task.linkedCustomer &&
					task.linkedCustomer.id === linkedCustomerId) ||
					(task.section &&
						task.section.project.customer &&
						task.section.project.customer.id ===
							linkedCustomerId))) &&
			(!task.section ||
				task.section.project.status !== 'REMOVED' ||
				projectId) &&
			(!projectId ||
				(task.section && task.section.project.id === projectId)) &&
			tags.every(tag => task.tags.some(taskTag => taskTag.id === tag)) &&
			!(task.assignee && task.assignee.id !== id)
	);

	const customers = {};
	const activities = [];

	let totalTime = 0;

	tasks.forEach(task => {
		const day = moment(task.finishedAt).format('YYYY-MM-DD');

		var activity = {
			name: task.name,
			date: task.finishedAt,
			value:
				(task.timeItTook ? task.timeItTook : task.unit) *
				workingTime *
				60 *
				60
		};

		const activityIndex = activities.findIndex(a => a.date === day);

		if (activityIndex !== -1) {
			activities[activityIndex].details.push(activity);
			activities[activityIndex].total =
				activities[activityIndex].total + activity.value;
		} else {
			activities.push({
				date: day,
				total: activity.value,
				details: [activity]
			});
		}

		if (
			task.status !== 'FINISHED' ||
			moment(task.createdAt).isBefore(moment().subtract(since, 'days')) ||
			(task.section && task.section.project.status === 'REMOVED') ||
			(task.assignee && task.assignee.id !== id)
		)
			return;

		const customer =
			task.linkedCustomer ||
			(task.section && task.section.project.customer);

		if (!customer) return;

		customers[customer.id] = customers[customer.id] || {
			value: 0,
			label: `${customer.name} (${formatName(
				customer.firstName,
				customer.lastName
			)})`
		};

		const time =
			typeof task.timeItTook === 'number' ? task.timeItTook : task.unit;

		customers[customer.id].value += time;
		totalTime += time;
	});

	const customerDistributions = Object.entries(customers).map(
		([key, obj]) => ({
			id: key,
			x: obj.label,
			y: obj.value / totalTime
		})
	);

	const reminders = filteredTasks
		.filter(t => t.status === 'FINISHED')
		.map(task => task.reminders)
		.flat();

	const tagsDistributions = filteredTasks.map(task => task.tags).flat();

	const arrayMap = tagsDistributions.reduce((acc, current) => {
		if (!acc[current.id]) {
			acc[current.id] = {...current, count: 1};
			return acc;
		}
		acc[current.id].count++;
		return acc;
	}, {});
	const result = Object.values(arrayMap);

	const tagsDistributionsList = Object.entries(result).map(([key, obj]) => ({
		id: key,
		x: obj.name,
		y: obj.count / tagsDistributions.length,
		colorBg: obj.colorBg
	}));

	// console.log("here");
	// console.log(activities);
	// console.log(filteredTasks);
	// console.log(reminders);

	return (
		<Container>
			<MetaHeading>
				<Heading style={{marginBottom: 0}}>
					<fbt project="inyo" desc="Statistics">
						Statistiques
					</fbt>
				</Heading>
				<TimeSelectContainer>
					<fbt project="inyo" desc="Show">
						Afficher{' '}
						<fbt:param name="timespan">
							{
								<TimeSelect
									selectedId={since}
									onChange={({value}) => setSince(value)}
									list={[
										{
											name: (
												<fbt
													project="inyo"
													desc="7 last days"
												>
													les 7 derniers jours
												</fbt>
											),
											id: 7
										},
										{
											name: (
												<fbt
													project="inyo"
													desc="30 last days"
												>
													les 30 derniers jours
												</fbt>
											),
											id: 30
										},
										{
											name: (
												<fbt
													project="inyo"
													desc="3 last months"
												>
													les 3 derniers mois
												</fbt>
											),
											id: 90
										},
										{
											name: (
												<fbt
													project="inyo"
													desc="6 last months"
												>
													les 6 derniers mois
												</fbt>
											),
											id: 180
										}
									]}
								/>
							}
						</fbt:param>
					</fbt>
				</TimeSelectContainer>
			</MetaHeading>

			<Section>
				<PageSubHeading>
					<fbt project="inyo" desc="client share">
						Votre activité
					</fbt>
					<HelpAndTooltip icon="help">
						<fbt desc="activity heatmqp">
							<p>
								Ce calendrier recense toutes les tâches marquées
								comme faîtes et vous donne un aperçu global de
								votre activité.
							</p>
						</fbt>
					</HelpAndTooltip>
				</PageSubHeading>
				<CalendarHeatmap
					data={activities}
					color={primaryPurple}
				></CalendarHeatmap>
			</Section>

			<Section>
				<PiesWrapper>
					<div>
						<PageSubHeading>
							<fbt project="inyo" desc="client share">
								Répartition de vos clients
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="client share tooltip">
									<p>
										Il s'agit de la répartition de votre
										activité parmi vos clients sur la
										période sélectionnée.
									</p>
								</fbt>
							</HelpAndTooltip>
						</PageSubHeading>
						<PieWrapper>
							<VictoryPie
								data={customerDistributions}
								colorScale={[
									'tomato',
									'orange',
									'gold',
									'cyan',
									'navy'
								]}
								innerRadius={50}
								labels={() => null}
							/>
							<Legend
								list={customerDistributions}
								colorScale={[
									'tomato',
									'orange',
									'gold',
									'cyan',
									'navy'
								]}
							/>
						</PieWrapper>
					</div>
					<div>
						<PageSubHeading>
							<fbt project="inyo" desc="client share">
								Répartition de votre activité
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="client share tooltip">
									<p>
										Il s'agit de la répartition de votre
										activité selon vos tags sur la période
										sélectionnée.
									</p>
								</fbt>
							</HelpAndTooltip>
						</PageSubHeading>
						<PieWrapper>
							<VictoryPie
								data={tagsDistributionsList}
								colorScale={[
									'tomato',
									'orange',
									'gold',
									'cyan',
									'navy'
								]}
								innerRadius={50}
								labels={() => null}
							/>
							<Legend
								list={tagsDistributionsList}
								colorScale={[
									'tomato',
									'orange',
									'gold',
									'cyan',
									'navy'
								]}
							/>
						</PieWrapper>
					</div>
				</PiesWrapper>
			</Section>

			<Section>
				<ArianneThread
					projectId={projectId}
					linkedCustomerId={linkedCustomerId}
					selectCustomer={setCustomerSelected}
					selectProjects={setProjectSelected}
					selectTag={setTagSelected}
					tagsSelected={tags}
					marginTop
					marginBottom
				/>
				<PageSubHeading>
					<fbt
						project="inyo"
						desc="Estimated time / worked time rate"
					>
						Rapport temps estimé / temps réellement passé
					</fbt>
					<HelpAndTooltip icon="help">
						<fbt desc="Estimated time / worked time rate tooltip">
							<p>
								Permet de mesurer votre productivité selon les
								filtres et la période sélectionnés.
							</p>
							<p>
								La zone blanche vous indique que vous avez plus
								rapide que prévu sur les tâches faites. Une
								barre violet claire représente le temps en sus
								de vos estimations.
							</p>
						</fbt>
					</HelpAndTooltip>
				</PageSubHeading>
				<TasksProgressBar
					showCompletionPercentage={false}
					project={{
						sections: filteredTasks
							.filter(t => t.status === 'FINISHED')
							.map(t => ({items: t}))
					}}
				/>
				<Cards>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="Worked time">
								Temps travaillé
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="Worked time tooltip">
									<p>
										La somme des heures réellement
										travaillées selon les filtres et la
										période sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{(
								filteredTasks
									.filter(t => t.status === 'FINISHED')
									.reduce(
										(total, {timeItTook}) =>
											total + timeItTook,
										0
									) * workingTime
							).toFixed(0)}
							h
						</Number>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 3,
									fill: mediumPurple
								},
								parent: {
									position: 'absolute',
									bottom: '-58px',
									left: '-1px'
								}
							}}
							y0={() => -10}
							height={250}
							padding={0}
							interpolation="natural"
							data={Object.entries(filteredTasks).map(
								([key, obj]) => ({
									x: obj.finishedAt || 0,
									y:
										(obj.timeItTook
											? obj.timeItTook
											: obj.unit) * workingTime || 0
								})
							)}
						/>
					</Card>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="estimated time">
								Temps estimé
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="estimated time tooltip">
									<p>
										La somme des heures intialement estimées
										selon les filtres et la période
										sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{(
								filteredTasks
									.filter(t => t.status === 'FINISHED')
									.reduce(
										(total, {unit}) => total + unit,
										0
									) * workingTime
							).toFixed(0)}
							h
						</Number>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 3,
									fill: mediumPurple
								},
								parent: {
									position: 'absolute',
									bottom: '-58px',
									left: '-1px'
								}
							}}
							y0={() => -10}
							height={250}
							padding={0}
							interpolation="natural"
							data={Object.entries(filteredTasks).map(
								([key, obj]) => ({
									x: obj.finishedAt || 0,
									y: obj.unit * workingTime || 0
								})
							)}
						/>
					</Card>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="reminders sent">
								Rappels envoyés
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="reminders sent tooltip">
									<p>
										Nombre de rappels que votre{' '}
										<i>Smart Assistant</i> a envoyé selon
										les filtres et la période sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{
								reminders.filter(
									reminder => reminder.status === 'SENT'
								).length
							}
						</Number>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 3,
									fill: mediumPurple
								},
								parent: {
									position: 'absolute',
									bottom: '-58px',
									left: '-1px'
								}
							}}
							y0={() => -1}
							height={250}
							padding={0}
							interpolation="natural"
							data={Object.entries(filteredTasks).map(
								([key, obj]) => ({
									x: obj.dueDate || 0,
									y: obj.reminders.length
								})
							)}
						/>
					</Card>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="Gained time">
								Temps gagné
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="Gained time tooltip">
									<p>
										Temps gagné grâce à l'utilisation
										d'Inyo, du fait des actions de votre{' '}
										<i>Smart Assistant</i>.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{moment
								.duration(
									reminders.filter(
										reminder => reminder.status === 'SENT'
									).length *
										15 +
										clientViews * 5,
									'minutes'
								)
								.format('h_mm_')}
							{console.log(reminders)}
						</Number>
					</Card>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="Client visits">
								Visites client
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="Client visits tooltip">
									<p>
										Nombre de visites de la part de vos
										clients sur les projets définis selon
										les filtres et la période sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>{clientViews}</Number>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 3,
									fill: mediumPurple
								},
								parent: {
									position: 'absolute',
									bottom: '-58px',
									left: '-1px'
								}
							}}
							y0={() => -1}
							height={250}
							padding={0}
							interpolation="natural"
							data={Object.entries(filteredTasks).map(
								([key, obj]) => ({
									x: obj.dueDate || 0,
									y: obj.reminders.length
								})
							)}
						/>
					</Card>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="estimated time">
								Montant travaillé
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="estimated time tooltip">
									<p>
										Valeur de votre travail selon{' '}
										<Link to="/app/account#settings">
											votre TJM
										</Link>{' '}
										et les filtres et période sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{new Intl.NumberFormat(language, {
								style: 'currency',
								currency: language === 'fr' ? 'EUR' : 'USD'
							}).format(
								filteredTasks
									.filter(t => t.status === 'FINISHED')
									.reduce(
										(total, {timeItTook}) =>
											total + timeItTook,
										0
									) * defaultDailyPrice
							)}
						</Number>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 3,
									fill: mediumPurple
								},
								parent: {
									position: 'absolute',
									bottom: '-58px',
									left: '-1px'
								}
							}}
							y0={() => -1000}
							height={250}
							padding={0}
							interpolation="natural"
							data={Object.entries(filteredTasks).map(
								([key, obj]) => ({
									x: obj.finishedAt || 0,
									y:
										(obj.timeItTook
											? obj.timeItTook
											: obj.unit) * defaultDailyPrice || 0
								})
							)}
						/>
					</Card>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="Worked time">
								Montant avenants
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="Extra worked time tooltip">
									<p>
										Le montant représenté par la somme des
										heures travaillées au-delà des
										estimations que vous devriez facturer
										selon les filtres et la période
										sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{new Intl.NumberFormat(language, {
								style: 'currency',
								currency: language === 'fr' ? 'EUR' : 'USD'
							}).format(
								filteredTasks
									.filter(t => t.status === 'FINISHED')
									.reduce(
										(total, {timeItTook, unit}) =>
											total + timeItTook - (total + unit),
										0
									) *
									workingTime *
									defaultDailyPrice
							)}
						</Number>
					</Card>
					<Card>
						<SubHeading>
							<MaterialIcon
								icon="add_circle_outline"
								size="medium"
								color="lightGrey"
							/>
						</SubHeading>
						<P>
							<fbt project="inyo" desc="stats question">
								Vous souhaitez d'autres statistiques?
								<A href="mailto:contact@inyo.me?subject=Page stats&body=Bonjour,%0D%0A%0D%0AIl serait intéressant d’avoir sur la page stats, des infos par rapport à…">
									Contactez-nous
								</A>
							</fbt>
						</P>
					</Card>
				</Cards>
			</Section>
		</Container>
	);
};

export default withRouter(Stats);
