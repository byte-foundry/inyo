import styled from '@emotion/styled/macro';
import React, {memo} from 'react';

import {BREAKPOINTS} from '../../utils/constants';
import IllusBackground from '../../utils/images/empty-tasks-background.svg';
import IllusFigure from '../../utils/images/empty-tasks-illus.svg';
import {
	CustomerSpan,
	IllusContainer,
	IllusFigureContainer,
	IllusText,
	P,
	UserSpan,
} from '../../utils/new/design-system';
import NormalTask from '../CustomerTaskRow';
import InlineTask from '../TaskRow';
import Tooltip from '../Tooltip';

const TasksListContainer = styled('div')`
	margin-top: 2rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-top: 1rem;
	}
`;

function TasksList({
	items,
	hasFilteredItems,
	customerToken,
	baseUrl,
	children,
	createTaskComponent,
	condensed = false,
	...rest
}) {
	const Task = condensed ? InlineTask : NormalTask;

	return (
		<TasksListContainer {...rest}>
			{items.map((item, index) => (createTaskComponent ? (
				createTaskComponent({item, index})
			) : (
				<Task
					item={item}
					key={item.id}
					customerToken={customerToken}
					baseUrl={baseUrl}
				/>
			)))}
			{children}
			{items.length === 0 && (
				<IllusContainer bg={IllusBackground}>
					<IllusFigureContainer fig={IllusFigure} />
					{hasFilteredItems ? (
						<IllusText>
							<P>Aucune tâche ne correspond à ses critères.</P>
						</IllusText>
					) : (
						<IllusText>
							<P>Aucune tâche à faire pour le moment.</P>
							<P>
								Dites-nous ce que{' '}
								<Tooltip label="Les tâches violettes sont les tâches que vous prévoyez de faire">
									<UserSpan>vous</UserSpan>
								</Tooltip>{' '}
								souhaitez faire aujourd'hui ou affectez des
								tâches à{' '}
								<Tooltip label="Les tâches roses sont les tâches qui peuvent déclencher des notifications pour votre client">
									<CustomerSpan>votre client</CustomerSpan>
								</Tooltip>
								.
							</P>
							<P>
								Cliquez sur l'icône pour choisir un type de
								tâche.
							</P>
						</IllusText>
					)}
				</IllusContainer>
			)}
		</TasksListContainer>
	);
}

export default memo(
	TasksList,
	(prevProps, nextProps) => prevProps
		&& prevProps.items.length === nextProps.items.length
		&& prevProps.items.every(
			(item, i) => item.name === nextProps.items[i].name
				&& item.dueDate === nextProps.items[i].dueDate
				&& item.unit === nextProps.items[i].unit
				&& ((item.linkedCustomer === undefined
					&& nextProps.items[i].linkedCustomer === undefined)
					|| (item.linkedCustomer
						&& nextProps.items[i].linkedCustomer
						&& item.linkedCustomer.id
							=== nextProps.items[i].linkedCustomer.id))
				&& item.status === nextProps.items[i].status,
		)
		&& prevProps.projectId === nextProps.projectId
		&& prevProps.customerId === nextProps.customerId
		&& prevProps.hasFilteredItems === nextProps.hasFilteredItems,
);
