import React, {useState} from 'react';
import Uppy, {Plugin} from '@uppy/core';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import XHRUpload from '@uppy/xhr-upload';

import {Button} from '../../utils/new/design-system';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

class graphqlUpload extends Plugin {
	constructor(uppy, opts) {
		super(uppy, opts);
		this.id = opts.id || 'graphqlupload';
		this.type = 'GraphQlUpload';
	}

	install() {
		this.uppy.addUploader((fileIDs) => {
			const files = fileIDs.map(fileID => this.uppy.getFile(fileID));


		}
	}
}

const uppy = Uppy({
	debug: true,
}).use();

function UploadDashboard() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Button icon="+" onClick={() => setModalOpen(true)}>
				Joindre un document
			</Button>
			<DashboardModal
				open={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				closeModalOnClickOutside
				uppy={uppy}
			/>
		</>
	);
}

export default UploadDashboard;
