import styled from '@emotion/styled';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {
	alpha10,
	gray50,
	P,
	primaryBlue,
	primaryNavyBlue,
	primaryWhite,
	secondaryLightBlue,
} from '../../utils/content';
import Plural from '../Plural';

const ProjectCardMain = styled('div')`
	position: relative;
	background-color: ${primaryWhite};
	box-shadow: 0px 0px 8px ${alpha10};
	cursor: pointer;
	margin-right: 10px;
	margin-bottom: 10px;
	border-radius: 3px;
	${props => (props.inRow ? 'flex: 0 0 450px;' : '')} &:hover {
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
			customer, issuedAt, createdAt, id, status, total = 0,
		} = project;
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		return (
			<ProjectCardMain
				{...this.props}
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
					{total.toLocaleString()}{' '}
					<Plural singular="jour" plural="jours" value={total} />
				</Amount>
			</ProjectCardMain>
		);
	}
}

export default withRouter(ProjectCard);
