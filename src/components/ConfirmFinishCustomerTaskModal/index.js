import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {P} from '../../utils/new/design-system';
import ConfirmModal from '../ConfirmModal';

const ConfirmFinishCustomerTaskModal = props => (
	<ConfirmModal {...props}>
		<P>
			<fbt project="inyo" desc="confirm modal finish customer task">
				Vous êtes sur le point de valider une tâche que votre client
				aurait du effectué par le biais de rappels automatiques.
			</fbt>
		</P>
		<P>
			<fbt
				project="inyo"
				desc="confirm modal finish customer task 2nd part"
			>
				Souhaitez vous continuer ?
			</fbt>
		</P>
	</ConfirmModal>
);

export default ConfirmFinishCustomerTaskModal;
