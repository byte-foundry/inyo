import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {ModalContainer, ModalElem} from '../../utils/content';
import {UNFOCUS_TASK} from '../../utils/mutations';
import {Button, P} from '../../utils/new/design-system';
import Task from '../CustomerTaskRow';

const WrapTasks = styled('div')`
	margin: 1rem 0 2rem;
`;

const RescheduleModal = ({tasks}) => {
	const [unfocusTask] = useMutation(UNFOCUS_TASK);

	return (
		<ModalContainer noClose>
			<ModalElem>
				<P>
					<fbt project="inyo" desc="reschedule modal description">
						Il semblerait qu'il y ait des tâches prévues les jours
						précédents que vous n'avez pas validées ou déplacées.
					</fbt>
				</P>
				<WrapTasks>
					{tasks.map(task => (
						<Task item={task} baseUrl="dashboard" />
					))}
				</WrapTasks>
				<Button
					onClick={() => tasks.forEach(task => unfocusTask({
						variables: {
							itemId: task.id,
						},
					}))
					}
				>
					<fbt project="inyo" desc="replace all task in list">
						Tout remettre dans la liste
					</fbt>
				</Button>
			</ModalElem>
		</ModalContainer>
	);
};

RescheduleModal.propTypes = {
	tasks: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.id,
		}),
	),
	onReschedule: PropTypes.func,
};

export default RescheduleModal;
