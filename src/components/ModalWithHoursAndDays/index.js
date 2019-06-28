import styled from '@emotion/styled';
import React from 'react';

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
					<H4>Comment travaillez-vous ?</H4>
				</ModalRow>
				<ModalRow>
					<P>
						Nous avons besoin de ces informations pour vous envoyer
						des emails au bon moment, en cohérence avec vos journées
						de travail.
					</P>
				</ModalRow>
				<ModalRow>
					<UserWorkHourAndDaysForm data={props.data} />
				</ModalRow>
			</ModalElem>
		</ModalContainer>
	);
}
