import React, {useState, useEffect} from 'react';
import {useMutation} from 'react-apollo-hooks';
import Uppy, {Plugin} from '@uppy/core';
import DashboardModal from '@uppy/react/lib/DashboardModal';

import {UPLOAD_ATTACHMENTS} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

class GraphQlUpload extends Plugin {
	constructor(uppy, opts) {
		super(uppy, opts);
		this.id = opts.id || 'graphqlupload';
		this.type = 'GraphQlUpload';

		this.mutation = opts.mutation;
		this.taskId = opts.taskId;
		this.projectId = opts.projectId;
	}

	install() {
		this.uppy.addUploader((fileIDs) => {
			const files = fileIDs.map(fileID => this.uppy.getFile(fileID).data);

			const fuck = this.mutation({
				variables: {
					taskId: this.taskId,
					projectId: this.projectId,
					files,
				},
				context: {hasUpload: true},
			});

			console.log(fuck);
			return fuck.then((zboub) => {
				console.log(zboub);
				return zboub;
			});
		});
	}
}

function UploadDashboard({taskId}) {
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
		}),
	);

	useEffect(
		() => function cleanup() {
			uppyState.close();
		},
		[],
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
			/>
		</>
	);
}

export default UploadDashboard;
