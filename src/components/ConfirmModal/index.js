import React from 'react';
import styled from '@emotion/styled';

import {Button} from '../../utils/new/design-system';
import {ModalContainer, ModalElem} from '../../utils/content';

const ModalRow = styled('div')`
	padding-left: 20px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const ModalRowHoriz = styled(ModalRow)`
	display: flex;
	justify-content: flex-end;
`;

export default function ConfirmModal({
	children,
	onConfirm,
	closeModal,
	onDismiss,
}) {
	return (
		<ModalContainer size="small" onDismiss={onDismiss || closeModal}>
			<ModalElem>
				<ModalRow>{children}</ModalRow>
				<ModalRowHoriz>
					<Button link onClick={() => onConfirm(false)}>
						Annuler
					</Button>
					<Button autoFocus onClick={() => onConfirm(true)}>
						Valider
					</Button>
				</ModalRowHoriz>
			</ModalElem>
		</ModalContainer>
	);
}
