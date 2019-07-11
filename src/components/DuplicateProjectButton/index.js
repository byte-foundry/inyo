import React, {forwardRef, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import {CREATE_PROJECT} from '../../utils/mutations';
import {Button, Input, P} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';
import ConfirmModal from '../ConfirmModal';

const DuplicateProjectModal = ({
	projectId, onCreate, onConfirm, ...rest
}) => {
	const {data, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});
	const [duplicateProject] = useMutation(CREATE_PROJECT);
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
							description: item.description,
							type: item.type,
							unit: item.timeItTook || item.unit || 0,
						})),
					}));

					const {
						data: {createProject},
					} = await duplicateProject({
						variables: {
							template: project.template,
							name,
							sections,
							customerId: project.customer && project.customer.id,
							deadline: project.deadline,
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

const DuplicateProjectButton = forwardRef(
	({
		children, projectId, onCreate, ...rest
	}, ref) => {
		const [isOpen, toggleModal] = useState(false);

		return (
			<>
				<Button {...rest} onClick={() => toggleModal(true)} ref={ref}>
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
	},
);

export default DuplicateProjectButton;
