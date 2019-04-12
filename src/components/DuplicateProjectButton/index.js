import React, {useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import ConfirmModal from '../ConfirmModal';
import {Button, P, Input} from '../../utils/new/design-system';

import {GET_PROJECT_DATA} from '../../utils/queries';
import {CREATE_PROJECT} from '../../utils/mutations';

const DuplicateProjectModal = ({
	projectId, onCreate, onConfirm, ...rest
}) => {
	const {data, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});
	const duplicateProject = useMutation(CREATE_PROJECT);
	const [name, setName] = useState(false);

	if (error) throw error;

	const {project} = data;

	return (
		<ConfirmModal
			onConfirm={async (confirmed) => {
				if (confirmed) {
					const sections = project.sections.map(section => ({
						name: section.name,
						items: section.items.map(item => ({
							name: item.name,
							reviewer: item.reviewer,
							description: item.description,
							type: item.type,
							unit: item.unit,
							// dueDate: item.dueDate,
							// linkedCustomerId: item.linkedCustomer,
						})),
					}));

					const {
						data: {createProject},
					} = await duplicateProject({
						variables: {
							template: project.template,
							name,
							sections,
							customerId: project.customer.id,
						},
					});

					onCreate(createProject);
				}
			}}
			{...rest}
		>
			<P>Titre du nouveau projet</P>
			<Input type="text" onChange={e => setName(e.target.value)} />
		</ConfirmModal>
	);
};

const DuplicateProjectButton = ({
	children, projectId, onCreate, ...rest
}) => {
	const [isOpen, toggleModal] = useState(false);

	return (
		<>
			<Button {...rest} onClick={() => toggleModal(true)}>
				{children}
			</Button>

			{isOpen && (
				<DuplicateProjectModal
					projectId={projectId}
					onCreate={onCreate}
					onConfirm={confirmed => toggleModal(confirmed)}
					closeModal={() => toggleModal(false)}
				/>
			)}
		</>
	);
};

export default DuplicateProjectButton;
