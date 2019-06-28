import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Uppy, {Plugin} from '@uppy/core';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import React, {useEffect, useState} from 'react';
import {useMutation} from 'react-apollo-hooks';

import {UPLOAD_ATTACHMENTS} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';

class GraphQlUpload extends Plugin {
	constructor(uppy, opts) {
		super(uppy, opts);
		this.id = opts.id || 'graphqlupload';
		this.type = 'GraphQlUpload';

		this.mutation = opts.mutation;
		this.token = opts.token;
		this.taskId = opts.taskId;
		this.projectId = opts.projectId;
	}

	install() {
		this.uppy.addUploader((fileIDs) => {
			const files = fileIDs.map(fileID => this.uppy.getFile(fileID).data);

			return this.mutation({
				variables: {
					token: this.token,
					taskId: this.taskId,
					projectId: this.projectId,
					files,
				},
				context: {hasUpload: true},
			});
		});
	}
}

function UploadDashboard({customerToken, taskId}) {
	const uploadAttachements = useMutation(UPLOAD_ATTACHMENTS, {
		refetchQueries: ['getAllTasks'],
	});
	const [modalOpen, setModalOpen] = useState(false);
	const [uppyState] = useState(
		Uppy({
			debuger: true,
		}).use(GraphQlUpload, {
			mutation: uploadAttachements,
			taskId,
			token: customerToken,
		}),
	);

	useEffect(
		() => function cleanup() {
			uppyState.close();
		},
		[uppyState],
	);

	return (
		<>
			<Button icon="+" onClick={() => setModalOpen(true)}>
				Joindre un document
			</Button>
			<DashboardModal
				open={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				closeModalOnClickOutside
				closeAfterFinish={true}
				uppy={uppyState}
				note="5Mo total maximum"
				locale={{
					strings: {
						closeModal: 'Fermer',
						cancel: 'Annuler',
						addMoreFiles: "Ajouter d'autres fichiers",
						importFrom: 'Importer',
						dashboardWindowTitle: 'Appuyer sur échap pour fermer',
						dashboardTitle: 'Téléversement de document',
						copyLinkToClipboardSuccess: 'Lien copié !',
						copyLinkToClipboardFallback: "Copiez l'url ci-dessous",
						copyLink: 'Copiez le lien',
						fileSource: 'Fichier source: %{name}',
						done: 'Terminé',
						removeFile: 'Retirer le fichier',
						editFile: 'Modifier le fichier',
						editing: 'Modification de %{file} en cours',
						edit: 'Modifier',
						finishEditingFile: 'Valider modification',
						myDevice: 'Mon appareil',
						dropPasteImport:
							'Déposer des fichiers ici, %{browse} votre ordinateur, ou importer de',
						dropPaste:
							'Déposer des fichiers ici ou %{browse} votre ordinateur',
						browse: 'parcourir',
						uploadComplete: 'Téléversement complété',
						resumeUpload: 'Reprendre téléversement',
						pauseUpload: 'Pauser téléversement',
						retryUpload: 'Réessayer téléversement',
						xFilesSelected: {
							0: '%{smart_count} fichier sélectionné',
							1: '%{smart_count} fichiers sélectionnés',
						},
						uploading: "En cours d'envoi",
						complete: 'Terminé',
					},
				}}
			/>
		</>
	);
}

export default UploadDashboard;
