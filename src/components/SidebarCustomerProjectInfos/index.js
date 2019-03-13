import React, {useContext} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import {SubHeading, primaryGrey, P} from '../../utils/new/design-system';
import Plural from '../Plural';
import IssuerNameAndAddress from '../IssuerNameAndAddress';

import {GET_PROJECT_INFOS} from '../../utils/queries';
import {TOOLTIP_DELAY, BREAKPOINTS} from '../../utils/constants';
import {CustomerContext} from '../../utils/contexts';

const Aside = styled('aside')`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 270px;
	padding-left: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 0;
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

const SidebarHeading = styled(SubHeading)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const SidebarCustomerProjectInfos = ({projectId}) => {
	const customerToken = useContext(CustomerContext);

	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId, token: customerToken},
	});

	if (error) throw error;

	const {project} = data;

	return (
		<Aside>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />

			<SubSection>
				<SidebarHeading>Votre prestataire</SidebarHeading>
				<IssuerNameAndAddress issuer={project.issuer} />
			</SubSection>

			<SubSection>
				<SidebarHeading>Deadline</SidebarHeading>
				<DateContainer>
					<BigNumber data-tip="Date limite du projet">
						{(project.deadline
							&& moment(project.deadline).format('DD/MM/YYYY')) || (
							<>&mdash;</>
						)}
					</BigNumber>
				</DateContainer>
			</SubSection>

			{project.daysUntilDeadline !== null && (
				<SubSection>
					<SubHeading>Marge jours restants</SubHeading>
					<BigNumber data-tip="Nombre de jours travaillés avant deadline">
						{project.daysUntilDeadline}&nbsp;
						<Plural
							value={project.daysUntilDeadline}
							singular="jour"
							plural="jours"
						/>
					</BigNumber>
				</SubSection>
			)}
		</Aside>
	);
};

export default withRouter(SidebarCustomerProjectInfos);
