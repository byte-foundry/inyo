import React from 'react';
import styled from 'react-emotion';

import {
	ModalContainer,
	ModalElem,
	ModalCloseIcon,
	H4,
	P,
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
					<H4>Besoin d'informations supplémentaires</H4>
				</ModalRow>
				<ModalRow>
					<P>
						Nous avons ajouté des fonctionnalités qui nécessite de
						nouvelle informations sur la façon dont vous travaillez.
					</P>
					<P>
						Un email vous sera envoyé par inyo chaque matin à
						l'heure ou vous commencez le travail c'est pourquoi nous
						vous demandons vos horaires de travail et vos jours
						travaillés
					</P>
				</ModalRow>
				<ModalRow>
					<UserWorkHourAndDaysForm data={props.data} />
				</ModalRow>
			</ModalElem>
		</ModalContainer>
	);
}
