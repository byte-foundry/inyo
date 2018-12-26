import gql from 'graphql-tag';
import React from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';

import Plural from '../Plural';
import TaskStatus from '../TaskStatus';
import {
	H2, H3, gray50, SpinningBubble,
} from '../../utils/content';
import CommentList from '../CommentList';

import {ReactComponent as TimeIcon} from '../../utils/icons/time.svg';
import {ReactComponent as ContactIcon} from '../../utils/icons/contact.svg';
import {ReactComponent as DateIcon} from '../../utils/icons/date.svg';

const GET_ITEM_DETAILS = gql`
	query getItemDetails($id: ID!, $token: String) {
		item(id: $id, token: $token) {
			id
			name
			status
			description
			unit
			reviewer
			section {
				id
				project {
					id
					name
					status
					deadline
					customer {
						id
						name
					}
				}
			}
		}
	}
`;

const Header = styled('div')`
	display: flex;
	align-items: baseline;
	color: ${gray50};

	span {
		margin: 0 5px;
	}
`;

const Meta = styled('div')`
	display: flex;
	align-items: center;
	color: ${gray50};
`;

const Item = ({id}) => (
	<Query query={GET_ITEM_DETAILS} variables={{id}}>
		{({loading, data, error}) => {
			if (loading) return <SpinningBubble />;
			if (error) throw error;

			const {item} = data;
			const {project} = item.section;

			const deadline = new Date(project.deadline);

			return (
				<>
					<Header>
						<TaskStatus
							status={item.status}
							itemId={item.id}
							sectionId={item.section.id}
							reviewer={item.reviewer}
							mode="see"
							customerViewMode={false}
							projectStatus={project.status}
						/>
						<H2>{item.name}</H2>
						<span>dans</span>
						<H3>{project.name}</H3>
					</Header>
					<Meta>
						<TimeIcon />
						{item.unit}
						&nbsp;
						<Plural
							singular="jour"
							plural="jours"
							value={item.unit}
						/>
						{deadline && (
							<>
								<DateIcon />
								<time
									title={deadline.toLocaleString()}
									dateTime={deadline}
								>
									{deadline.toLocaleDateString()}
								</time>
							</>
						)}
						<ContactIcon />
						{project.customer.name}
					</Meta>
					<p>{item.description || "Il n'y a pas de description."}</p>
					<CommentList itemId={item.id} />
				</>
			);
		}}
	</Query>
);

export default Item;
