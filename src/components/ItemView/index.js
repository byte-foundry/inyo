import React from 'react';
import {Query, Mutation} from 'react-apollo';
import styled from '@emotion/styled';
import {Link} from 'react-router-dom';

import Plural from '../Plural';
import TaskStatus from '../TaskStatus';
import {
	H2,
	H3,
	H4,
	gray50,
	gray70,
	SpinningBubble,
	primaryBlue,
	primaryNavyBlue,
} from '../../utils/content';
import CheckList from '../CheckList';
import CommentList from '../CommentList';

import {GET_ITEM_DETAILS} from '../../utils/queries';
import {UPDATE_ITEM} from '../../utils/mutations';
import {ReactComponent as TimeIcon} from '../../utils/icons/time.svg';
import {ReactComponent as ContactIcon} from '../../utils/icons/contact.svg';
import {ReactComponent as DateIcon} from '../../utils/icons/date.svg';

const Header = styled('div')`
	display: flex;
	justify-content: start;
	margin-bottom: 1em;

	h2 {
		font-size: 2rem;
		margin: 10px 0;
	}
`;

const ProjectName = styled(H3)`
	font-size: 1.4rem;
	margin: 0;

	a {
		color: ${primaryBlue};
		text-decoration: none;

		&:hover {
			color: ${primaryNavyBlue};
		}
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

const Description = styled('div')`
	color: ${gray70};
	line-height: 1.6;
	margin-top: 20px;
	margin-bottom: 25px;
	margin-left: 0;
`;

const Item = ({
	id, customerToken, finishItem, projectUrl,
}) => (
	<Query query={GET_ITEM_DETAILS} variables={{id, token: customerToken}}>
		{({loading, data, error}) => {
			debugger;
			if (loading) return <SpinningBubble />;
			if (error) throw error;

			const {item} = data;
			let {description} = item;
			const {project} = item.section;

			const deadline = new Date(project.deadline);

			// parse the description for the file list
			let files = [];
			const fileListRegex = /([\s\S])+# content-acquisition-list\n([^#]+)$/;

			if (fileListRegex.test(item.description)) {
				const matches = item.description
					.match(fileListRegex)[0]
					.split('# content-acquisition-list');

				const fileItemRegex = /- \[([ x])\] (.+)/;

				files = matches
					.pop()
					.split('\n')
					.filter(line => fileItemRegex.test(line))
					.map(line => ({
						checked: /^- \[[x]]/.test(line),
						name: line.match(fileItemRegex).pop(),
					}));
				description = matches.join('# content-acquisition-list');
			}

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
								customerViewMode={!!customerToken}
								projectStatus={project.status}
								finishItem={finishItem}
							/>
						</div>
						<div>
							<ProjectName>
								<Link
									to={
										projectUrl
										|| `/app/projects/${project.id}/see`
									}
								>
									{project.name}
								</Link>
							</ProjectName>
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
						{deadline.toString() !== 'Invalid Date' && (
							<Meta>
								<DateIcon />
								<MetaTime
									title={deadline.toLocaleString()}
									dateTime={deadline.toJSON()}
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
					<Description>{description}</Description>
					{item.type === 'CONTENT_ACQUISITION' && (
						<>
							<H4>Contenus à récupérer</H4>
							<Mutation mutation={UPDATE_ITEM}>
								{updateItem => (
									<CheckList
										editable={!customerToken} // editable by user only, but checkable
										items={files}
										onChange={({items}) => {
											updateItem({
												variables: {
													itemId: item.id,
													token: customerToken,
													description: description.concat(
														`\n# content-acquisition-list\n${items
															.map(
																({
																	checked,
																	name,
																}) => `- [${
																	checked
																		? 'x'
																		: ' '
																}] ${name}`,
															)
															.join('\n')}`,
													),
												},
											});
										}}
									/>
								)}
							</Mutation>
						</>
					)}
					<H4>Commentaires</H4>
					<CommentList
						itemId={item.id}
						customerToken={customerToken}
					/>
				</>
			);
		}}
	</Query>
);

export default Item;
