import React from 'react';
import styled from '@emotion/styled/macro';
import {withRouter} from 'react-router-dom';
import {useQuery} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';

import TasksProgressBar from '../../../components/TasksProgressBar';
import {ReactComponent as TrashIcon} from '../../../utils/icons/trash-icon.svg';
import {ReactComponent as ArchiveIcon} from '../../../utils/icons/archive-icon.svg';

import {TOOLTIP_DELAY} from '../../../utils/constants';

import {GET_ALL_PROJECTS} from '../../../utils/queries';
import {
	Main,
	Container,
	Content,
	SubHeading,
	Button,
	primaryGrey,
	primaryPurple,
	lightGrey,
	accentGrey,
	primaryRed,
} from '../../../utils/new/design-system';

const SmallContent = styled(Content)`
	max-width: 640px;
	margin: 0 auto;
`;

const ProjectTitle = styled(SubHeading)`
	color: ${primaryGrey};
	font-size: 1.3rem;
	font-weight: 400;
	text-transform: none;
	margin-bottom: 0.5rem;
	flex: 1;
	position: relative;
`;

const ProjectHeader = styled('div')`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	:hover ${ProjectTitle} {
		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.5rem;
			top: -0.5rem;
			right: -0.5rem;
			bottom: -0.5rem;
			border-radius: 8px;
			z-index: -1;
		}
	}
`;

const ActionsIconContainer = styled('div')`
	cursor: pointer;
	position: relative;
	padding: 0 0 0 0.5rem;
	margin-top: -0.25rem;
	margin-left: 1rem;
	display: flex;
	align-items: center;

	transition: all 300ms ease;
	margin-right: -3rem;
	opacity: 0;
`;

const ProjectItem = styled('div')`
	cursor: pointer;
	position: relative;
	margin-bottom: 0.5rem;

	:hover ${ProjectTitle} {
		color: ${primaryPurple};
	}

	:hover ${ActionsIconContainer} {
		margin-right: 0;
		opacity: 1;
	}
`;

const TrashButton = styled(Button)`
	padding: 0 0 0 0.25rem;
	border: none;
	border-radius: 50%;

	svg {
		fill: ${accentGrey};
	}

	&:hover {
		background: none;
		svg {
			fill: ${primaryRed};
		}
	}
`;

const ArchiveButton = styled(Button)`
	padding: 0 0 0 0.25rem;
	border: none;
	border-radius: 50%;

	svg {
		fill: ${accentGrey};
	}

	&:hover {
		background: none;
		svg {
			fill: ${primaryPurple};
		}
	}
`;

function Projects({history}) {
	const {
		data: {
			me: {projects},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS);

	return (
		<Container>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			<Main>
				<SmallContent>
					{projects.map(project => (
						<ProjectItem
							onClick={() => history.push(
								`/app/tasks?projectId=${project.id}`,
							)
							}
						>
							<ProjectHeader>
								<ProjectTitle>{project.name}</ProjectTitle>
								<ActionsIconContainer>
									<TrashButton
										// onClick={onClickTrash}
										data-tip="Supprimer ce projet"
									>
										<TrashIcon />
									</TrashButton>
									<ArchiveButton
										// onClick={onClickArchive}
										data-tip="Archiver ce projet"
									>
										<ArchiveIcon />
									</ArchiveButton>
								</ActionsIconContainer>
							</ProjectHeader>
							<TasksProgressBar project={project} />
						</ProjectItem>
					))}
				</SmallContent>
			</Main>
		</Container>
	);
}

export default withRouter(Projects);
