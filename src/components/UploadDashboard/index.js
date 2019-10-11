import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Uppy, {Plugin} from '@uppy/core';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import React, {useEffect, useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
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
	const [uploadAttachements] = useMutation(UPLOAD_ATTACHMENTS, {
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
				<fbt project="inyo" desc="notification message">
					Joindre un document
				</fbt>
			</Button>
			<DashboardModal
				open={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				closeModalOnClickOutside
				closeAfterFinish={true}
				uppy={uppyState}
				note={
					<fbt project="inyo" desc="upload note">
						5Mo total maximum
					</fbt>
				}
				locale={{
					strings: {
						closeModal: (
							<fbt project="inyo" desc="upload close message">
								Fermer
							</fbt>
						),
						cancel: (
							<fbt project="inyo" desc="upload cancel message">
								Annuler
							</fbt>
						),
						addMoreFiles: (
							<fbt project="inyo" desc="upload add more files">
								Ajouter d'autres fichiers
							</fbt>
						),
						importFrom: (
							<fbt project="inyo" desc="upload import from">
								Importer
							</fbt>
						),
						dashboardWindowTitle: (
							<fbt project="inyo" desc="upload windows title">
								Appuyer sur échap pour fermer
							</fbt>
						),
						dashboardTitle: (
							<fbt project="inyo" desc="upload title">
								Téléversement de document
							</fbt>
						),
						copyLinkToClipboardSuccess: (
							<fbt project="inyo" desc="upload link copied">
								Lien copié !
							</fbt>
						),
						copyLinkToClipboardFallback: (
							<fbt
								project="inyo"
								desc="upload manual link copy message"
							>
								Copiez l'url ci-dessous
							</fbt>
						),
						copyLink: (
							<fbt project="inyo" desc="upload copy link message">
								Copiez le lien
							</fbt>
						),
						fileSource: (
							<fbt
								project="inyo"
								desc="upload source file message"
							>
								Fichier source:{' '}
								<fbt:param name="name">{'%{name}'}</fbt:param>
							</fbt>
						),
						done: (
							<fbt project="inyo" desc="done">
								Terminé
							</fbt>
						),
						removeFile: (
							<fbt project="inyo" desc="remove file">
								Retirer le fichier
							</fbt>
						),
						editFile: (
							<fbt project="inyo" desc="edit file">
								Modifier le fichier
							</fbt>
						),
						editing: (
							<fbt project="inyo" desc="editing file">
								Modification de{' '}
								<fbt:param name="file">{'%{file}'}</fbt:param>{' '}
								en cours
							</fbt>
						),
						edit: (
							<fbt project="inyo" desc="edit">
								Modifier
							</fbt>
						),
						finishEditingFile: (
							<fbt project="inyo" desc="confirm modification">
								Valider modification
							</fbt>
						),
						myDevice: (
							<fbt project="inyo" desc="my device">
								Mon appareil
							</fbt>
						),
						dropPasteImport: (
							<fbt
								project="inyo"
								desc="drop file here or import message"
							>
								Déposer des fichiers ici,{' '}
								<fbt:param name="browse">
									{'%{browse}'}
								</fbt:param>{' '}
								votre ordinateur, ou importer de
							</fbt>
						),
						dropPaste: (
							<fbt project="inyo" desc="drop file here ">
								Déposer des fichiers ici ou{' '}
								<fbt:param name="browser">
									{'%{browse}'}
								</fbt:param>{' '}
								votre ordinateur
							</fbt>
						),
						browse: (
							<fbt project="inyo" desc="browse">
								parcourir
							</fbt>
						),
						uploadComplete: (
							<fbt project="inyo" desc="upload complete">
								Téléversement complété
							</fbt>
						),
						resumeUpload: (
							<fbt project="inyo" desc="resume upload">
								Reprendre téléversement
							</fbt>
						),
						pauseUpload: (
							<fbt project="inyo" desc="pause upload">
								Pauser téléversement
							</fbt>
						),
						retryUpload: (
							<fbt project="inyo" desc="retry upload">
								Réessayer téléversement
							</fbt>
						),
						xFilesSelected: {
							0: (
								<fbt
									project="inyo"
									desc="file selected count 1"
								>
									<fbt:param name="smartCount">
										{'%{smart_count}'}
									</fbt:param>{' '}
									fichier sélectionné
								</fbt>
							),
							1: (
								<fbt
									project="inyo"
									desc="file selected count 2 or more"
								>
									<fbt:param name="smartCount">
										{'%{smart_count}'}
									</fbt:param>{' '}
									fichiers sélectionnés
								</fbt>
							),
						},
						uploading: (
							<fbt project="inyo" desc="uploading">
								En cours d'envoi
							</fbt>
						),
						complete: (
							<fbt project="inyo" desc="complete">
								Terminé
							</fbt>
						),
					},
				}}
			/>
		</>
	);
}

export default UploadDashboard;
