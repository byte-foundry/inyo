import styled from '@emotion/styled';
import moment from 'moment';
import React, {useContext} from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import {BREAKPOINTS} from '../../utils/constants';
import {CustomerContext} from '../../utils/contexts';
import {
	P,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import IconButton from '../IconButton';
import IssuerNameAndAddress from '../IssuerNameAndAddress';
import Plural from '../Plural';
import Tooltip from '../Tooltip';

const Aside = styled('aside')`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	min-width: 270px;
	width: 270px;
	padding-right: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-top: 2rem;
		padding-right: 0;
		width: 100%;
	}
`;

const SubSection = styled('div')`
	margin-bottom: 2rem;
`;

const BigNumber = styled(P)`
	font-size: 20px;
	font-weight: 500;
	color: ${primaryGrey};
`;

const DateContainer = styled('div')`
	position: relative;
`;

const SidebarLink = styled('div')`
	display: block;
	align-items: center;
	color: ${props => (props.active ? primaryPurple : primaryGrey)};
	text-decoration: none;
	font-weight: 500;
	margin-bottom: 0.4rem;
	cursor: ${props => (props.active ? 'default' : 'pointer')};
	pointer-events: ${props => (props.active ? 'none' : 'all')};
	position: relative;
	max-width: calc(100% - 2rem);

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
	}

	div {
		&:after {
			display: ${props => (props.active ? 'block' : 'none')};
		}
		i {
			color: ${props => (props.active ? primaryWhite : '')} !important;
		}
	}
`;

const SidebarHeading = styled(SubHeading)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const SidebarCustomerProjectInfos = ({projectId, location, history}) => {
	const query = new URLSearchParams(location.search);
	const activeView = query.get('view');

	const customerToken = useContext(CustomerContext);
	const token = customerToken === 'preview' ? undefined : customerToken;

	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId, token},
		suspend: true,
	});

	if (error) throw error;

	const {project} = data;

	function setView(view) {
		const newQuery = new URLSearchParams(location.search);

		newQuery.delete('filter');
		newQuery.set('view', view);
		history.push(`/app/${customerToken}/tasks/?${newQuery.toString()}`);
	}

	return (
		<Aside>
			<SubSection>
				<SidebarLink
					onClick={() => setView('tasks')}
					active={activeView === 'tasks' || !activeView}
				>
					<IconButton
						icon="format_list_bulleted"
						size="tiny"
						label="Tâches du projet"
						current={activeView === 'tasks' || !activeView}
					/>
				</SidebarLink>
				<SidebarLink
					onClick={() => setView('shared-notes')}
					active={activeView === 'shared-notes'}
				>
					<IconButton
						icon="people_outline"
						size="tiny"
						label="Notes partagées"
						current={activeView === 'shared-notes'}
					/>
				</SidebarLink>
			</SubSection>
			<SubSection>
				<SidebarHeading>Votre prestataire</SidebarHeading>
				<IssuerNameAndAddress issuer={project.issuer} />
			</SubSection>

			{project.deadline && (
				<SubSection>
					<SidebarHeading>Deadline</SidebarHeading>
					<DateContainer>
						<Tooltip label="Date limite du projet">
							<BigNumber>
								{moment(project.deadline).format('DD/MM/YYYY')}
							</BigNumber>
						</Tooltip>
					</DateContainer>
				</SubSection>
			)}

			{project.daysUntilDeadline !== null && (
				<SubSection>
					<SubHeading>Marge jours restants</SubHeading>
					<Tooltip label="Nombre de jours travaillés avant deadline">
						<BigNumber>
							{project.daysUntilDeadline}&nbsp;
							<Plural
								value={project.daysUntilDeadline}
								singular="jour"
								plural="jours"
							/>
						</BigNumber>
					</Tooltip>
				</SubSection>
			)}
		</Aside>
	);
};

export default withRouter(SidebarCustomerProjectInfos);
