import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled/macro';

import TaskInput from '../TaskInput';
import {TaskContainer} from '../TasksList/task';
import ConfirmModal, {useConfirmation} from '../ConfirmModal';
import {P} from '../../utils/new/design-system';

import {
	ADD_ITEM,
	CREATE_PROJECT,
	ADD_SECTION,
	UPDATE_PROJECT,
} from '../../utils/mutations';
import {
	GET_PROJECT_DATA,
	GET_PROJECT_NOTIFY_ACTIVITY,
} from '../../utils/queries';

const TaskInputContainer = styled('div')`
	& + ${TaskContainer} {
		margin-top: 3rem;
	}
`;

const isCustomerTask = task => ['CUSTOMER', 'CONTENT_ACQUISITION', 'VALIDATION'].includes(task.type);

const CreateTask = ({setProjectSelected, currentProjectId}) => {
	const createTask = useMutation(ADD_ITEM);
	const createProject = useMutation(CREATE_PROJECT);
	const addSection = useMutation(ADD_SECTION);
	const {data: currentProjectData} = useQuery(GET_PROJECT_NOTIFY_ACTIVITY, {
		variables: {id: currentProjectId},
		skip: !currentProjectId,
		suspend: true,
	});
	const updateProject = useMutation(UPDATE_PROJECT);

	const [confirmModal, askConfirmationNotification] = useConfirmation();

	const props = {};

	if (currentProjectId) {
		props.onSubmitSection = section => addSection({
			variables: {
				projectId: currentProjectId,
				position: 0,
				...section,
			},
			update: (cache, {data: {addSection: addedSection}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: currentProjectId},
				});

				const {project} = data;

				project.sections.unshift(addedSection);

				cache.writeQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: currentProjectId},
					data,
				});
			},
		});
	}
	else {
		props.onSubmitProject = async (project) => {
			const {
				data: {
					createProject: {id, name},
				},
			} = await createProject({variables: project});

			setProjectSelected({value: id});
			setProjectSelected({value: id, label: name}, true);
		};
	}

	return (
		<TaskInputContainer>
			<TaskInput
				onSubmitTask={async (task) => {
					if (
						currentProjectData
						&& !currentProjectData.project.notifyActivityToCustomer
						&& isCustomerTask(task)
					) {
						const confirmed = await askConfirmationNotification();

						if (!confirmed) return false;

						await updateProject({
							variables: {
								projectId: currentProjectId,
								notifyActivityToCustomer: true,
							},
						});
					}

					return createTask({
						variables: {projectId: currentProjectId, ...task},
						update: (cache, {data: {addItem: addedItem}}) => {
							const data = cache.readQuery({
								query: GET_PROJECT_DATA,
								variables: {projectId: currentProjectId},
							});

							if (data.project.sections.length === 0) {
								data.project.sections.push({
									...addedItem.section,
									items: [addedItem],
								});

								cache.writeQuery({
									query: GET_PROJECT_DATA,
									variables: {projectId: currentProjectId},
									data,
								});
							}
						},
					});
				}}
				currentProjectId={currentProjectId}
				{...props}
			/>

			{confirmModal && (
				<ConfirmModal
					onConfirm={confirmModal}
					onDismiss={() => confirmModal(false)}
				>
					<P>
						Vous souhaitez créer une tâche attribuée au client qui
						nécessite d'activer les notifications par email à
						celui-ci.
					</P>
					<P>
						Souhaitez vous continuer et activer les notifications?
					</P>
				</ConfirmModal>
			)}
		</TaskInputContainer>
	);
};

export default CreateTask;
