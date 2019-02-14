import React from 'react';
import styled from '@emotion/styled';
import {Link} from 'react-router-dom';
import {useQuery, useMutation} from 'react-apollo-hooks';

import TaskStatusButton from '../TaskStatusButton';
import Plural from '../Plural';
import {gray50, gray70, SpinningBubble} from '../../utils/content';
import CheckList from '../CheckList';
import CommentList from '../CommentList';
import MultilineEditable from '../MultilineEditable';

import {GET_ITEM_DETAILS} from '../../utils/queries';
import {UPDATE_ITEM} from '../../utils/mutations';
import {ReactComponent as TimeIcon} from '../../utils/icons/time.svg';
import {ReactComponent as ContactIcon} from '../../utils/icons/contact.svg';
import {ReactComponent as DateIcon} from '../../utils/icons/date.svg';
import {TaskHeading, SubHeading, Button} from '../../utils/new/design-system';

const Header = styled('div')`
	margin-bottom: 1em;

	h2 {
		font-size: 2rem;
		margin: 10px 0;
	}
`;

const Metas = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-row-gap: 0.5em;
	color: ${gray50};
	padding-bottom: 1em;
`;

const Meta = styled('div')`
	display: flex;
	align-items: center;

	svg {
		margin-right: 15px;
	}
`;

const MetaLabel = styled('div')`
	flex: 1;
`;

const MetaText = styled('span')`
	flex: 1;

	:empty::before {
		content: ' - ';
	}
`;

const MetaTime = styled(MetaText)``;

const Description = styled('div')`
	color: ${gray70};
	line-height: 1.6;
	margin-top: 20px;
	margin-bottom: 25px;
	margin-left: -4rem;
	margin-right: -4rem;
	background-color: #faf8fe;
	min-height: 5rem;
	display: flex;

	textarea {
		min-height: 5rem;
	}
`;

const StickyHeader = styled('div')`
	position: sticky;
	top: 0;
	background: #5020ee;
	margin: -4rem -4rem 1.4rem;
	display: flex;
	justify-content: center;
	padding: 1rem;
`;

const Item = ({id, customerToken, projectUrl}) => {
	const updateItem = useMutation(UPDATE_ITEM);
	const {loading, data, error} = useQuery(GET_ITEM_DETAILS, {
		suspend: false,
		variables: {id, token: customerToken},
	});

	if (loading) return <SpinningBubble />;
	if (error) throw error;

	const {item} = data;
	const {linkedCustomer: customer, type} = item;

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
			<StickyHeader>
				<TaskStatusButton />
			</StickyHeader>
			<Header>
				<TaskHeading>{item.name}</TaskHeading>
			</Header>
			<Metas>
				<Meta>
					<TimeIcon />
					<MetaLabel>Temps estimé</MetaLabel>
					<MetaText>
						{item.unit}
						<Plural
							singular=" jour"
							plural=" jours"
							value={item.unit}
						/>
					</MetaText>
				</Meta>
				<Meta>
					<ContactIcon />
					<MetaLabel>Client</MetaLabel>
					<MetaText>{customer && customer.name}</MetaText>
				</Meta>
				{deadline.toString() !== 'Invalid Date' && (
					<Meta>
						<DateIcon />
						<MetaLabel>Temps restant</MetaLabel>
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
					<MetaLabel>Projet</MetaLabel>
					<MetaText>{project && project.name}</MetaText>
				</Meta>
				<Meta>
					<ContactIcon />
					<MetaLabel>Type de tâche</MetaLabel>
					<MetaText>{type}</MetaText>
				</Meta>
			</Metas>
			<Button grey icon="+">
				Ajouter une catégorie
			</Button>
			<Description>
				<MultilineEditable
					placeholder="Ajouter une description…"
					style={{padding: '1rem 4rem'}}
					onBlur={e => updateItem({
						variables: {
							itemId: id,
							token: customerToken,
							description: e.target.innerText || undefined,
						},
					})
					}
					defaultValue={description}
				/>
			</Description>
			{item.type === 'CONTENT_ACQUISITION' && (
				<>
					<SubHeading>Contenus à récupérer</SubHeading>
					<CheckList
						editable={!customerToken} // editable by user only, but checkable
						items={files}
						onChange={({items}) => {
							updateItem({
								variables: {
									itemId: id,
									token: customerToken,
									description: description.concat(
										`\n# content-acquisition-list\n${items
											.map(
												({checked, name}) => `- [${
													checked ? 'x' : ' '
												}] ${name}`,
											)
											.join('\n')}`,
									),
								},
							});
						}}
					/>
				</>
			)}
			<SubHeading>Commentaires</SubHeading>
			<CommentList itemId={item.id} customerToken={customerToken} />
		</>
	);
};

export default Item;
