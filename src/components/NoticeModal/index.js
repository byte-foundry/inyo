import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {ModalContainer, ModalElem} from '../../utils/content';
import {Button} from '../../utils/new/design-system';

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

const NoticeModal = ({children, onDismiss}) => (
	<ModalContainer size="small" onDismiss={onDismiss}>
		<ModalElem>
			<ModalRow>{children}</ModalRow>
			<ModalRowHoriz>
				<Button aligned autoFocus onClick={onDismiss}>
					<fbt project="inyo" desc="notice modal close">
							Fermer
					</fbt>
				</Button>
			</ModalRowHoriz>
		</ModalElem>
	</ModalContainer>
);

export default NoticeModal;
