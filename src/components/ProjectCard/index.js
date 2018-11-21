import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import Plural from '../Plural';
import {
	P,
	alpha10,
	primaryNavyBlue,
	gray50,
	secondaryLightBlue,
	primaryBlue,
	primaryWhite,
} from '../../utils/content';

const ProjectCardMain = styled('div')`
	position: relative;
	background-color: ${primaryWhite};
	box-shadow: 0px 0px 8px ${alpha10};
	cursor: pointer;
	margin-right: 10px;
	margin-bottom: 10px;
	border-radius: 3px;

	&:hover {
		box-shadow: 0px 0px 25px ${alpha10};
	}
`;

const CardHeader = styled('div')`
	border-bottom: 1px solid ${secondaryLightBlue};
	padding: 8px 16px 15px 16px;
`;

const ProjectName = styled(P)`
	margin: 0;
	color: ${primaryNavyBlue};
`;
const ClientName = styled(P)`
	margin: 0;
	color: ${primaryBlue};
	font-size: 80%;
`;
const DateOfIssue = styled('span')`
	color: ${gray50};
	font-size: 13px;
`;
const Amount = styled('div')`
	padding: 8px 16px 15px 16px;
	font-size: 24px;
	color: ${primaryNavyBlue};
	text-align: right;
`;

class ProjectCard extends Component {
	render() {
		const {project} = this.props;
		const {
			customer, issuedAt, createdAt, id, status, total,
		} = project;
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		return (
			<ProjectCardMain
				onClick={() => {
					this.props.history.push(
						`/app/projects/${id}/${
							status === 'DRAFT' ? 'edit' : 'see'
						}`,
					);
				}}
			>
				<CardHeader>
					<ClientName>{customer.name}</ClientName>
					<ProjectName>{project.name}</ProjectName>
					<DateOfIssue>
						{issuedAt
							? new Date(issuedAt).toLocaleDateString(
								'fr-FR',
								options,
							  )
							: new Date(createdAt).toLocaleDateString(
								'fr-FR',
								options,
							  )}
					</DateOfIssue>
				</CardHeader>
				<Amount>
					{total || 0}{' '}
					<Plural singular="jour" plural="jours" value={total} />
				</Amount>
			</ProjectCardMain>
		);
	}
}

export default withRouter(ProjectCard);
