import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useCallback} from 'react';
import {Link, withRouter} from 'react-router-dom';
import CalendarHeatmap from 'reactjs-calendar-heatmap';
import {
	VictoryArea, VictoryBar, VictoryPie, VictoryStack,
} from 'victory';

import ArianneThread, {ArianneElem} from '../../../components/ArianneThread';
import HelpAndTooltip from '../../../components/HelpAndTooltip';
import Legend from '../../../components/Legend';
import MaterialIcon from '../../../components/MaterialIcon';
import TasksProgressBar from '../../../components/TasksProgressBar';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS, TAG_COLOR_PALETTE} from '../../../utils/constants';
import {FlexRow} from '../../../utils/content';
import {formatName} from '../../../utils/functions';
import {
	A,
	Heading,
	lightGrey,
	lightPurple,
	mediumPurple,
	P,
	primaryBlack,
	primaryPurple,
	primaryRed,
	SubHeading,
} from '../../../utils/new/design-system';
import {GET_ALL_TASKS_STATS} from '../../../utils/queries';
import useUserInfos from '../../../utils/useUserInfos';

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
	font-size: ${props => (props.big ? '10rem' : '2.3rem')};
	line-height: ${props => (props.big ? 1 : 'inherit')};
	color: ${props => (props.big ? mediumPurple : 'inherit')};
	font-weight: ${props => (props.big ? 900 : 500)};
	margin: 0;
	position: relative;
	z-index: 0;
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
	display: grid;
	grid-template-columns: 1fr 1fr;
	justify-content: space-between;
	gap: 80px;
`;

const PieWrapper = styled('div')`
	display: grid;
	grid-template-columns: 1fr 200px;
	align-items: center;
	grid-gap: 20px;
`;

const filterTasks = (
	tasks,
	filterProp,
	since,
	linkedCustomerId,
	projectId,
	tags,
	id,
) => tasks.filter(
	task => moment(task[filterProp]).isSameOrAfter(
		moment().subtract(since, 'days'),
	)
			&& (!linkedCustomerId
				|| ((task.linkedCustomer
					&& task.linkedCustomer.id === linkedCustomerId)
					|| (task.section
						&& task.section.project.customer
						&& task.section.project.customer.id
							=== linkedCustomerId)))
			&& (!task.section
				|| task.section.project.status !== 'REMOVED'
				|| projectId)
			&& (!projectId
				|| (task.section && task.section.project.id === projectId))
			&& tags.every(tag => task.tags.some(taskTag => taskTag.id === tag))
			&& !(task.assignee && task.assignee.id !== id),
);

const Stats = ({history, location}) => {
	const {
		data: {
			me: {id, tasks},
		},
		error,
	} = useQuery(GET_ALL_TASKS_STATS, {suspend: true});
	const {
		workingTime = 8, defaultDailyPrice = 0, clientViews, language,
	}
		= useUserInfos() || {};

	const query = new URLSearchParams(location.search);

	const since = parseInt(query.get('since'), 10) || 30;
	const projectId = query.get('projectId');
	const tags = query.getAll('tags');
	const linkedCustomerId = query.get('customerId');

	let overview = 'year';

	if (since <= 7) {
		overview = 'week';
	}
	else if (since <= 31) {
		overview = 'month';
	}

	if (error) throw error;

	const setSince = useCallback(
		(value) => {
			const newQuery = new URLSearchParams(query);

			newQuery.set('since', value);

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query],
	);

	const setProjectSelected = useCallback(
		(selected, removeCustomer) => {
			const newQuery = new URLSearchParams(query);

			if (selected) {
				const {value: selectedProjectId} = selected;

				newQuery.set('projectId', selectedProjectId);
			}
			else if (newQuery.has('projectId')) {
				newQuery.delete('projectId');
			}

			if (removeCustomer) {
				newQuery.delete('customerId');
			}

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query, history],
	);

	const setCustomerSelected = useCallback(
		(selected) => {
			const newQuery = new URLSearchParams(query);

			if (selected) {
				const {value: selectedCustomerId} = selected;

				newQuery.set('customerId', selectedCustomerId);
			}
			else if (newQuery.has('customerId')) {
				newQuery.delete('customerId');
			}

			if (newQuery.has('projectId')) {
				newQuery.delete('projectId');
			}

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query, history],
	);

	const setTagSelected = useCallback(
		(selected) => {
			const newQuery = new URLSearchParams(query);

			if (selected) {
				newQuery.delete('tags');
				selected.forEach(tag => newQuery.append('tags', tag.value));
			}

			history.push(`/app/stats?${newQuery.toString()}`);
		},
		[query, history],
	);

	const filteredTasks = filterTasks(
		tasks,
		'finishedAt',
		since,
		linkedCustomerId,
		projectId,
		tags,
		id,
	);
	const createdAtFilteredTasks = filterTasks(
		tasks,
		'createdAt',
		since,
		linkedCustomerId,
		projectId,
		tags,
		id,
	);

	const customers = {};
	const daysMap = {};

	let totalTime = 0;

	tasks.forEach((task) => {
		if (!task.finishedAt) return;

		const day = moment(task.finishedAt).format('YYYY-MM-DD');

		daysMap[day] = daysMap[day] || {
			date: day,
			total: 0,
			estimatedTime: 0,
			totalPrice: 0,
			details: [],
		};

		const activity = {
			name: task.name,
			date: task.scheduledFor ? task.scheduledFor : task.finishedAt,
			value:
				(task.timeItTook ? task.timeItTook : task.unit)
				* workingTime
				* 60
				* 60,
			estimatedTime:
				task.unit > 0 ? task.unit * workingTime * 60 * 60 : 0,
			dailyRate: task.dailyRate || defaultDailyPrice,
		};

		daysMap[day].details.push(activity);
		daysMap[day].total += activity.value;
		daysMap[day].totalPrice += activity.dailyRate * activity.value;

		if (
			task.status !== 'FINISHED'
			|| moment(task.createdAt).isBefore(moment().subtract(since, 'days'))
			|| (task.section && task.section.project.status === 'REMOVED')
			|| (task.assignee && task.assignee.id !== id)
		) return;

		const customer
			= task.linkedCustomer
			|| (task.section && task.section.project.customer);

		if (!customer) return;

		customers[customer.id] = customers[customer.id] || {
			value: 0,
			label: `${customer.name} (${formatName(
				customer.firstName,
				customer.lastName,
			)})`,
		};

		const time
			= typeof task.timeItTook === 'number' ? task.timeItTook : task.unit;

		customers[customer.id].value += time;
		totalTime += time;
	});

	const activities = Object.values(daysMap).map((d) => {
		const summary = d.details.reduce((uniques, project) => {
			if (!uniques[project.name]) {
				uniques[project.name] = {
					value: project.value,
					estimatedTime: project.estimatedTime,
				};
			}
			else {
				uniques[project.name].value += project.value;
				uniques[project.name].estimatedTime += project.estimatedTime;
			}
			return uniques;
		}, {});
		const unsorted_summary = Object.keys(summary).map(key => ({
			name: key,
			value: summary[key].value,
			estimatedTime: summary[key].estimatedTime,
		}));
		d.summary = unsorted_summary.sort((a, b) => b.value - a.value);
		return d;
	});

	const reminders = createdAtFilteredTasks.map(task => task.reminders).flat();

	const allDayWithTasks = [];
	const startDate = moment();

	for (let i = 0; i < since; i++) {
		const currentDate = moment(startDate)
			.subtract(i, 'days')
			.format('YYYY-MM-DD');
		const activity = activities.find(a => a.date === currentDate);
		const remindersForDay = reminders.filter(
			r => moment(r.sendingDate).format('YYYY-MM-DD') === currentDate,
		);

		allDayWithTasks.push({
			date: currentDate,
			activity,
			reminders: remindersForDay,
		});
	}

	const customerDistributions = Object.entries(customers).map(
		([key, obj]) => ({
			id: key,
			x: obj.label,
			y: obj.value ? obj.value / totalTime : 0,
		}),
	);

	const tagsHours = {
		notag: {
			id: 'notag',
			x: 'Non classée',
			colorBg: '#f8f9fc',
			y: 0,
		},
	};

	filteredTasks.forEach((task) => {
		const unit = task.timeItTook ? task.timeItTook : task.unit;

		if (task.tags.length === 0) {
			tagsHours.notag.y += unit;
		}

		task.tags.forEach((tag) => {
			tagsHours[tag.id] = tagsHours[tag.id] || {
				id: tag.id,
				x: tag.name,
				colorBg: tag.colorBg,
				y: 0,
			};

			tagsHours[tag.id].y += unit;
		});
	});

	const tagsHoursList = Object.values(tagsHours);

	const defaultTagsColorPalette = Object.values(
		TAG_COLOR_PALETTE.map(x => `rgb(${x[0]})`),
	);

	let maxHoursWorkedInADay = 0;
	let maxPricedDay = 0;

	activities.forEach((t) => {
		if (
			t.date !== 'Invalid date'
			&& moment(t.date).isSameOrAfter(moment().subtract(since, 'days'))
		) {
			maxHoursWorkedInADay = Math.max(
				maxHoursWorkedInADay,
				t.total / 60 / 60,
			);
			maxPricedDay = Math.max(
				maxPricedDay,
				t.totalPrice / 60 / 60 / workingTime,
			);
		}
	});

	const workedTime = filteredTasks
		.filter(t => t.status === 'FINISHED')
		.reduce((total, {timeItTook}) => total + timeItTook, 0);

	const estimatedTime = filteredTasks
		.filter(t => t.status === 'FINISHED')
		.reduce((total, {unit}) => total + unit, 0);

	const amendment
		= workedTime - estimatedTime < 0
			? 0
			: Math.abs((workedTime - estimatedTime) * defaultDailyPrice);

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
											name: fbt(
												'les 7 derniers jours',
												'7 last days',
											),
											id: 7,
										},
										{
											name: fbt(
												'les 30 derniers jours',
												'30 last days',
											),
											id: 30,
										},
										{
											name: fbt(
												'les 3 derniers mois',
												'3 last months',
											),
											id: 90,
										},
										{
											name: fbt(
												'les 6 derniers mois',
												'6 last months',
											),
											id: 180,
										},
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
					key={overview}
					data={activities}
					color={primaryPurple}
					overColor={primaryRed}
					overview={overview}
					workingTime={workingTime}
					handler={(d) => {
						history.push(
							`/app/dashboard?from=${moment(d.date).format(
								'YYYY-MM-DD',
							)}`,
						);
					}}
				/>
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
								data={
									customerDistributions.length > 0
										? customerDistributions
										: [
											{
												x: fbt(
													'Aucun client lié',
													'no linked customer stats',
												),
												y: 100,
											},
										  ]
								}
								colorScale={
									customerDistributions.length > 0
										? defaultTagsColorPalette
										: [lightGrey]
								}
								innerRadius={50}
								labels={[]}
							/>
							<Legend
								list={
									customerDistributions.length > 0
										? customerDistributions
										: [
											{
												x: fbt(
													'Aucun client lié',
													'no linked customer stats page',
												),
												y: 0,
											},
										  ]
								}
								colorScale={
									customerDistributions.length > 0
										? defaultTagsColorPalette
										: [lightGrey]
								}
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
								data={tagsHoursList}
								colorScale={tagsHoursList.map(t => t.colorBg)}
								innerRadius={50}
								labels={[]}
							/>
							<Legend
								list={tagsHoursList}
								workingTime={workingTime}
								colorScale={tagsHoursList.map(t => t.colorBg)}
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
							.map(t => ({items: t})),
					}}
				/>
				<Cards>
					<Card>
						<SubHeading>
							<fbt project="inyo" desc="Worked time">
								Temps travaillé / estimé
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="Worked time tooltip">
									<p>
										La somme des heures réellement
										travaillées / estimées selon les filtres
										et la période sélectionnés.
									</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{(workedTime * workingTime).toFixed(0)}h /{' '}
							{(estimatedTime * workingTime).toFixed(0)}h
						</Number>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 3,
									fill: mediumPurple,
								},
								parent: {
									position: 'absolute',
									bottom: '-88px',
									left: '-1px',
								},
							}}
							y0={() => -maxHoursWorkedInADay / 3}
							height={220}
							padding={0}
							domain={{
								y: [
									-maxHoursWorkedInADay / 3,
									maxHoursWorkedInADay * 1.2,
								],
							}}
							minDomain={{y: -maxHoursWorkedInADay / 2}}
							interpolation="natural"
							data={allDayWithTasks
								.reverse()
								.map((obj, index) => ({
									x: index,
									y: obj.activity
										? obj.activity.total / 60 / 60
										: 0,
								}))}
						/>
						<VictoryArea
							style={{
								data: {
									stroke: primaryPurple,
									strokeWidth: 2,
									strokeDasharray: '6, 6',
									fill: 'transparent',
								},
								parent: {
									position: 'absolute',
									bottom: '-88px',
									left: '-1px',
								},
							}}
							height={220}
							padding={0}
							domain={{
								y: [
									-maxHoursWorkedInADay / 3,
									maxHoursWorkedInADay * 1.2,
								],
							}}
							minDomain={{y: -maxHoursWorkedInADay / 2}}
							interpolation="natural"
							data={allDayWithTasks.map((obj, index) => ({
								x: index,
								y: obj.activity
									? obj.activity.estimatedTime / 60 / 60
									: 0,
							}))}
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
								currency: language === 'fr' ? 'EUR' : 'USD',
							}).format(workedTime * defaultDailyPrice)}
						</Number>
						<VictoryStack
							style={{
								parent: {
									position: 'absolute',
									bottom: '-88px',
									left: '-1px',
								},
							}}
							padding={{left: 20, right: 20}}
							height={220}
						>
							<VictoryBar
								style={{
									data: {
										fill: mediumPurple,
										opacity: 0.2,
									},
									parent: {
										position: 'absolute',
										bottom: '-88px',
										left: '-1px',
									},
								}}
								height={220}
								data={allDayWithTasks.map((obj, index) => ({
									x: index,
									y: obj.activity
										? obj.activity.total / 60 / 60
										: 0,
								}))}
							/>
							<VictoryBar
								style={{
									data: {
										fill: mediumPurple,
									},
									parent: {
										position: 'absolute',
										bottom: '-88px',
										left: '-1px',
									},
								}}
								height={220}
								data={allDayWithTasks.map((obj, index) => ({
									x: index,
									y: obj.activity
										? obj.activity.totalPrice
										: 0,
								}))}
							/>
						</VictoryStack>
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
								currency: language === 'fr' ? 'EUR' : 'USD',
							}).format(amendment)}
						</Number>
						<VictoryPie
							startAngle={-90}
							endAngle={90}
							data={[
								{x: 'b', y: amendment},
								{x: 'a', y: estimatedTime * defaultDailyPrice},
							]}
							style={{
								parent: {
									position: 'absolute',
									bottom: '-88px',
									left: 0,
								},
							}}
							colorScale={[primaryRed, mediumPurple]}
							innerRadius={75}
							labels={() => null}
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
						<FlexRow alignItems="baseline">
							<Number big>
								{
									reminders.filter(
										reminder => reminder.status === 'SENT',
									).length
								}
							</Number>
							<MaterialIcon icon="mail" color={primaryBlack} />
						</FlexRow>
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
						<FlexRow alignItems="baseline">
							<Number big>{clientViews}</Number>
							<MaterialIcon
								icon="remove_red_eye"
								color={primaryBlack}
							/>
						</FlexRow>
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
										reminder => reminder.status === 'SENT',
									).length
										* 15
										+ clientViews * 5,
									'minutes',
								)
								.format('h[h]m[m]')}
						</Number>
						<SubHeading>
							<fbt project="inyo" desc="Soit">
								Soit
							</fbt>
							<HelpAndTooltip icon="help">
								<fbt desc="From personnal Daily rate">
									<p>Calculé d'après votre TJM.</p>
								</fbt>
							</HelpAndTooltip>
						</SubHeading>
						<Number>
							{new Intl.NumberFormat(language, {
								style: 'currency',
								currency: language === 'fr' ? 'EUR' : 'USD',
							}).format(
								((reminders.filter(
									reminder => reminder.status === 'SENT',
								).length
									* (15 / 60)
									+ clientViews * (5 / 60))
									/ workingTime)
									* defaultDailyPrice,
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
