import styled from '@emotion/styled/macro';
import React, {useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import {formatName, isCustomerTask} from '../../utils/functions';
import {ADD_ITEM, ADD_SECTION, UPDATE_PROJECT} from '../../utils/mutations';
import {P} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';
import ConfirmModal, {useConfirmation} from '../ConfirmModal';
import CreateProjectModal from '../CreateProjectModal';
import {TaskContainer} from '../CustomerTaskRow';
import TaskInput from '../TaskInput';

const TaskInputContainer = styled('div')`
	& + ${TaskContainer} {
		margin-top: 3rem;
	}
`;

const CreateTask = ({currentProjectId, withProject}) => {
	const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');
	const [createTask] = useMutation(ADD_ITEM);
	const [addSection] = useMutation(ADD_SECTION);
	const [updateProject] = useMutation(UPDATE_PROJECT);
	const [confirmModal, askConfirmationNotification] = useConfirmation();
	const {data: currentProjectData, loading, error} = useQuery(
		GET_PROJECT_DATA,
		{
			variables: {projectId: currentProjectId},
			skip: !currentProjectId,
			suspend: true,
		},
	);

	if (loading) return false;
	if (error) throw error;

	const props = {};

	if (currentProjectId) {
		props.onSubmitSection = section => addSection({
			variables: {
				projectId: currentProjectId,
				position: 0,
				...section,
			},
		});
	}
	else {
		props.onSubmitProject = async (project) => {
			setOpenCreateProjectModal(true);
			setNewProjectName(project.name);
		};
	}

	return (
		<TaskInputContainer>
			<TaskInput
				withProject={withProject}
				defaultCustomer={
					currentProjectData
					&& currentProjectData.project.customer && {
						id: currentProjectData.project.customer.id,
						name: `${
							currentProjectData.project.customer.name
						} (${formatName(
							currentProjectData.project.customer.firstName,
							currentProjectData.project.customer.lastName,
						)})`,
					}
				}
				onSubmitTask={async (task) => {
					if (
						currentProjectData
						&& !currentProjectData.project.notifyActivityToCustomer
						&& isCustomerTask(task.type)
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

					if (currentProjectId && task.projectId === undefined) {
						delete task.projectId;
					}

					return createTask({
						variables: {projectId: currentProjectId, ...task},
						update: (cache, {data: {addItem: addedItem}}) => {
							if (!currentProjectId) return;

							const data = cache.readQuery({
								query: GET_PROJECT_DATA,
								variables: {projectId: currentProjectId},
							});

							if (data.project.sections.length === 0) {
								cache.writeQuery({
									query: GET_PROJECT_DATA,
									variables: {projectId: currentProjectId},
									data: {
										...data,
										project: {
											...data.project,
											sections: [
												...data.project.sections,
												{
													...addedItem.section,
													items: [addedItem],
												},
											],
										},
									},
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
			{openCreateProjectModal && (
				<CreateProjectModal
					onDismiss={() => {
						setOpenCreateProjectModal(false);
						setNewProjectName('');
					}}
					baseName={newProjectName}
				/>
			)}
		</TaskInputContainer>
	);
};

export default CreateTask;
