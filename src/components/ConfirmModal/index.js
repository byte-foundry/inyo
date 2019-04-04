import React, {useState} from 'react';
import styled from '@emotion/styled';

import {Button} from '../../utils/new/design-system';
import {ModalContainer, ModalElem} from '../../utils/content';

const ModalRow = styled('div')`
	padding: 1rem 2rem;
	display: flex;
	flex-direction: column;
`;

const ModalRowHoriz = styled(ModalRow)`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

export const useConfirmation = () => {
	const [promise, setPromise] = useState();

	return [
		promise ? promise.resolve : false,
		async () => {
			const newPromise = new Promise((resolve) => {
				setPromise({resolve});
			});

			const confirmed = await newPromise;

			setPromise();

			return confirmed;
		},
	];
};

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
