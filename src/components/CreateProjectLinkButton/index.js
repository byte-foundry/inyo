import React, {useState} from 'react';
import styled from '@emotion/styled';

import {ReactComponent as LinkIcon} from '../../utils/icons/link-icon.svg';
import {SubHeading, Input, Button} from '../../utils/new/design-system';
import {
	ModalContainer,
	ModalElem,
	FlexColumn,
	ModalActions,
} from '../../utils/content';

const ModalContent = styled(FlexColumn)`
	margin-top: 2rem;
`;

function CreateProjectLinkButton({project}) {
	const [openLinkModal, setOpenLinkModal] = useState(false);
	const projectId = project.id;
	const customerToken = project.customer
		? project.customer.token
		: project.token;

	return (
		<>
			<Button onClick={() => setOpenLinkModal(true)}>
				<LinkIcon /> Créer un lien pour partager
			</Button>
			{openLinkModal && (
				<ModalContainer
					size="small"
					onDismiss={() => setOpenLinkModal(false)}
				>
					<ModalElem>
						<SubHeading>
							Lien pour partager votre projet avec votre client
						</SubHeading>
						<ModalContent>
							<Input
								big
								value={`https://beta.inyo.me/app/${customerToken}/tasks?projectId=${projectId}`}
							/>
						</ModalContent>
						<ModalActions>
							<Button onClick={() => setOpenLinkModal(false)}>
								Fermer
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
		</>
	);
}

export default CreateProjectLinkButton;
