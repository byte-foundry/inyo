import React, {useState} from 'react';

import {Button} from '../../utils/new/design-system';

import RemoveProjectModal from '../RemoveProjectModal';

const RemoveProjectButton = ({
	children, projectId, onRemove, ...rest
}) => {
	const [isOpen, toggleModal] = useState(false);

	return (
		<>
			<Button {...rest} onClick={() => toggleModal(true)}>
				{children}
			</Button>

			{isOpen && (
				<RemoveProjectModal
					onRemove={onRemove}
					projectId={projectId}
					closeModal={() => toggleModal(false)}
				/>
			)}
		</>
	);
};

export default RemoveProjectButton;
