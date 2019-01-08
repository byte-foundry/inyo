import gql from 'graphql-tag';
import React from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';

import Plural from '../Plural';
import TaskStatus from '../TaskStatus';
import {
	H2,
	H3,
	gray50,
	gray70,
	SpinningBubble,
	primaryBlue,
	secondaryLightBlue,
} from '../../utils/content';
import CommentList from '../CommentList';

import {GET_ITEM_DETAILS} from '../../utils/queries';
import {ReactComponent as TimeIcon} from '../../utils/icons/time.svg';
import {ReactComponent as ContactIcon} from '../../utils/icons/contact.svg';
import {ReactComponent as DateIcon} from '../../utils/icons/date.svg';

const Header = styled('div')`
	display: flex;
	justify-content: start;
	margin-bottom: 1em;

	h3 {
		font-size: 1.4rem;
		color: ${primaryBlue};
		margin: 0;
	}

	h2 {
		font-size: 2rem;
		margin: 10px 0;
	}
`;

const Metas = styled('div')`
	display: flex;
	align-items: center;
	color: ${gray50};
	margin-left: -5px;
	padding-bottom: 1em;
`;

const Meta = styled('div')`
	display: flex;
	margin-right: 15px;
	align-items: center;
`;

const MetaText = styled('span')`
	margin-left: 5px;
`;

const MetaTime = styled('time')`
	margin-left: 5px;
`;

const NoDescription = styled('div')`
	color: ${gray50};
`;

const Description = styled('div')`
	color: ${gray70};
	line-height: 1.6;
	margin-top: 20px;
	margin-bottom: 25px;
	margin-left: 0;
`;

const Item = ({id, finishItem}) => (
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
						<div>
							<TaskStatus
								status={item.status}
								itemId={item.id}
								sectionId={item.section.id}
								reviewer={item.reviewer}
								mode="see"
								customerViewMode={false}
								projectStatus={project.status}
								finishItem={finishItem}
							/>
						</div>
						<div>
							<H3>{project.name}</H3>
							<H2>{item.name}</H2>
						</div>
					</Header>
					<Metas>
						<Meta>
							<TimeIcon />
							<MetaText>
								{item.unit}
								<Plural
									singular=" jour"
									plural=" jours"
									value={item.unit}
								/>
							</MetaText>
						</Meta>
						{deadline && (
							<Meta>
								<DateIcon />
								<MetaTime
									title={deadline.toLocaleString()}
									dateTime={deadline}
								>
									{deadline.toLocaleDateString()}
								</MetaTime>
							</Meta>
						)}
						<Meta>
							<ContactIcon />
							<MetaText>{project.customer.name}</MetaText>
						</Meta>
					</Metas>
					<Description>{item.description}</Description>
					<CommentList itemId={item.id} />
				</>
			);
		}}
	</Query>
);

export default Item;
