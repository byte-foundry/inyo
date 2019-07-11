import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {ModalActions, ModalContainer, ModalElem} from '../../utils/content';
import {ARCHIVE_PROJECT, REMOVE_PROJECT} from '../../utils/mutations';
import {Button, Heading, P} from '../../utils/new/design-system';

function RemoveProject({closeModal, projectId, onRemove = () => {}}) {
	const [removeProject] = useMutation(REMOVE_PROJECT);
	const [archiveProject] = useMutation(ARCHIVE_PROJECT);

	return (
		<ModalContainer onDismiss={() => closeModal()}>
			<ModalElem>
				<Heading>
					Êtes-vous sûr de vouloir supprimer ce projet ?
				</Heading>
				<P>
					En ce supprimant ce projet vous perdrez toutes les données.
				</P>
				<P>
					Cette option est présente pour supprimer un projet créé par
					erreur.
				</P>
				<P>Pour les projets terminés, préférez l'archivage :)</P>
				<ModalActions>
					<Button grey onClick={() => closeModal()}>
						Annuler
					</Button>
					<Button
						primary
						onClick={() => {
							archiveProject({
								variables: {
									projectId,
								},
							});
							closeModal();
						}}
					>
						Archiver le projet
					</Button>
					<Button
						red
						onClick={() => {
							removeProject({
								variables: {
									projectId,
								},
							});
							closeModal();
							onRemove();
						}}
					>
						Supprimer le projet
					</Button>
				</ModalActions>
			</ModalElem>
		</ModalContainer>
	);
}

export default RemoveProject;
