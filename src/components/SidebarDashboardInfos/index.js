import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {Loading} from '../../utils/content';
import noRemindersIllus from '../../utils/images/bermuda-done.svg';
import {
	Aside,
	lightGrey,
	primaryGrey,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_REMINDERS, GET_USER_INFOS} from '../../utils/queries';
import Apostrophe from '../Apostrophe';
import TaskRemindersList from '../TaskRemindersList';

const DashboardAside = styled(Aside)`
	padding: 1.5rem 0 0 4rem;
	max-width: 320px;
	flex: 0 0 320px;
	display: flex;

	margin-right: 1rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 0;
		flex: 1;
		max-width: none;
		width: 100%;
		margin-bottom: 1rem;
		margin-right: 0;
	}

	img {
		align-self: center;
		max-width: 40%;
		margin: 1rem 30%;
	}
`;

const SubSection = styled('div')`
	margin-bottom: 2rem;
	margin-top: 1rem;
	position: relative;
	min-height: 200px;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-bottom: 1rem;
		margin-left: 1rem;
		margin-right: 1rem;
	}

	&:before {
		content: '';
		display: block;
		background: ${lightGrey};
		position: absolute;
		left: -1rem;
		top: -1rem;
		right: -1rem;
		bottom: -1rem;
		border-radius: 8px;
		z-index: -1;
	}
`;

const SidebarHeading = styled(SubHeading)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const NoReminders = styled('div')`
	font-style: italic;
	color: ${primaryGrey};
`;

const SidebarDashboardInfos = () => {
	const {data, loading} = useQuery(GET_REMINDERS, {suspend: false});
	const {loading: loadingUser, data: userData} = useQuery(GET_USER_INFOS);

	const reminders
		= data
		&& data.reminders.filter(reminder => reminder.status === 'PENDING');
	const {me} = userData || {};

	return (
		<DashboardAside>
			<SubSection>
				{loadingUser && <Loading />}
				{!loadingUser && (
					<SidebarHeading>
						<fbt project="inyo" desc="actions of edwige">
							Actions{' '}
							<fbt:param name="apos">
								<Apostrophe
									value={me.settings.assistantName}
									withVowel={
										<fbt
											project="inyo"
											desc="notification message"
										>
											d'
										</fbt>
									}
									withConsonant={
										<fbt
											project="inyo"
											desc="notification message"
										>
											de{' '}
										</fbt>
									}
								/>
							</fbt:param>
							<fbt:param name="assistantName">
								{me.settings.assistantName}
							</fbt:param>
						</fbt>
					</SidebarHeading>
				)}
				{loading && <Loading />}
				{!loading
					&& (reminders.length > 0 ? (
						<TaskRemindersList
							small
							reminders={reminders}
							baseUrl="/app/dashboard"
						/>
					) : (
						<NoReminders>
							<img alt="" src={noRemindersIllus} />
							<fbt project="inyo" desc="notification message">
								Aucune tâche client n’ont été activées pour le
								moment
							</fbt>
						</NoReminders>
					))}
			</SubSection>
		</DashboardAside>
	);
};

export default SidebarDashboardInfos;
