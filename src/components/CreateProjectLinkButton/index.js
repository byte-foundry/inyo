import styled from '@emotion/styled';
import React, {useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {
	FlexColumn,
	ModalActions,
	ModalContainer,
	ModalElem,
} from '../../utils/content';
import {Button, Input, SubHeading} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';

const ModalContent = styled(FlexColumn)`
	margin-top: 2rem;
`;

function CreateProjectLinkButton({project}) {
	const [openLinkModal, setOpenLinkModal] = useState(false);
	const projectId = project.id;
	const customerToken = project.customer
		? project.customer.token
		: project.token;

	const {protocol, host} = window.location;

	return (
		<>
			<Button
				onClick={() => setOpenLinkModal(true)}
				id="create-project-link"
			>
				<MaterialIcon icon="link" size="tiny" color="inherit" />{' '}
				<fbt project="inyo" desc="create project link label">
					Créer un lien pour partager
				</fbt>
			</Button>
			{openLinkModal && (
				<ModalContainer
					size="small"
					onDismiss={() => setOpenLinkModal(false)}
				>
					<ModalElem>
						<SubHeading>
							<fbt
								project="inyo"
								desc="project link modal header"
							>
								Lien pour partager votre projet avec votre
								client
							</fbt>
						</SubHeading>
						<ModalContent>
							<Input
								big
								value={`${protocol}//${host}/app/${customerToken}/tasks?projectId=${projectId}`}
							/>
						</ModalContent>
						<ModalActions>
							<Button onClick={() => setOpenLinkModal(false)}>
								<fbt
									project="inyo"
									desc="project link modal close button"
								>
									Fermer
								</fbt>
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
		</>
	);
}

export default CreateProjectLinkButton;
