import styled from '@emotion/styled';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';

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

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 0;
		flex: 1;
		max-width: none;
		width: 100%;
		margin-bottom: 1rem;
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
	const {
		loading: loadingUser,
		data: {me},
	} = useQuery(GET_USER_INFOS);

	const reminders
		= data.reminders
		&& data.reminders.filter(reminder => reminder.status === 'PENDING');

	return (
		<DashboardAside>
			<SubSection>
				{loadingUser && <Loading />}
				{!loadingUser && (
					<SidebarHeading>
						Actions{' '}
						<Apostrophe
							value={me.settings.assistantName}
							withVowel="d'"
							withConsonant="de "
						/>{' '}
						{me.settings.assistantName}
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
							Aucune tâches client n’ont été activées pour le
							moment
						</NoReminders>
					))}
			</SubSection>
		</DashboardAside>
	);
};

export default SidebarDashboardInfos;
