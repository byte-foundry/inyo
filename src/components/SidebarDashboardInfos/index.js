import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {Loading} from '../../utils/content';
import noRemindersIllus from '../../utils/images/bermuda-done.svg';
import {primaryGrey, SubHeading} from '../../utils/new/design-system';
import {GET_REMINDERS, GET_USER_INFOS} from '../../utils/queries';
import Apostrophe from '../Apostrophe';
import TaskRemindersList from '../TaskRemindersList';

const Wrapper = styled('div')`
	padding: 1rem;
	display: flex;

	img {
		max-width: 40%;
		display: block;
		margin-bottom: 1rem;
	}
`;

const SubSection = styled('div')`
	position: relative;
	flex: 1;
	max-width: 100%;
`;

const SidebarHeading = styled(SubHeading)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const NoReminders = styled('div')`
	font-style: italic;
	color: ${primaryGrey};
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const SidebarDashboardInfos = ({onOpenSubPortal}) => {
	const {data, loading} = useQuery(GET_REMINDERS);
	const {loading: loadingUser, data: userData} = useQuery(GET_USER_INFOS);

	const reminders
		= data
		&& data.reminders.filter(reminder => reminder.status === 'PENDING');
	const {me} = userData || {};

	return (
		<Wrapper>
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
										<>
											<fbt
												project="inyo"
												desc="notification message"
											>
												de
											</fbt>{' '}
										</>
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
							onOpenSubPortal={onOpenSubPortal}
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
		</Wrapper>
	);
};

export default SidebarDashboardInfos;
