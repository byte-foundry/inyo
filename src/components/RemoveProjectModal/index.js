import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import fbt from '../../fbt/fbt.macro';
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
					<fbt project="inyo" desc="delete project heading">
						Êtes-vous sûr de vouloir supprimer ce projet ?
					</fbt>
				</Heading>
				<P>
					<fbt project="inyo" desc="delete project first paragraph">
						En ce supprimant ce projet vous perdrez toutes les
						données.
					</fbt>
				</P>
				<P>
					<fbt project="inyo" desc="delete project second paragraph">
						Cette option est présente pour supprimer un projet créé
						par erreur.
					</fbt>
				</P>
				<P>
					<fbt project="inyo" desc="delete project third paragraph">
						Pour les projets terminés, préférez l'archivage :)
					</fbt>
				</P>
				<ModalActions>
					<Button grey onClick={() => closeModal()}>
						<fbt project="inyo" desc="cancel">
							Annuler
						</fbt>
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
						<fbt project="inyo" desc="archive project">
							Archiver le projet
						</fbt>
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
						<fbt project="inyo" desc="delete project">
							Supprimer le projet
						</fbt>
					</Button>
				</ModalActions>
			</ModalElem>
		</ModalContainer>
	);
}

export default RemoveProject;
