import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {
	H4, ModalContainer, ModalElem, P,
} from '../../utils/content';
import UserWorkHourAndDaysForm from '../UserWorkHourAndDaysForm';

const ModalRow = styled('div')`
	padding-left: 20px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

export default function ModalWithHoursAndDays(props) {
	return (
		<ModalContainer>
			<ModalElem>
				<ModalRow>
					<H4>
						<fbt
							project="inyo"
							desc="modal with hours and days title"
						>
							Comment travaillez-vous ?
						</fbt>
					</H4>
				</ModalRow>
				<ModalRow>
					<P>
						<fbt
							project="inyo"
							desc="modal with hours and days content"
						>
							Nous avons besoin de ces informations pour vous
							envoyer des emails au bon moment, en cohérence avec
							vos journées de travail.
						</fbt>
					</P>
				</ModalRow>
				<ModalRow>
					<UserWorkHourAndDaysForm data={props.data} />
				</ModalRow>
			</ModalElem>
		</ModalContainer>
	);
}
