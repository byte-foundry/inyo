import React, {useState} from 'react';
import Uppy from '@uppy/core';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import XHRUpload from '@uppy/xhr-upload';

import {Button} from '../../utils/new/design-system';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

const uppy = Uppy({
	debug: true,
}).use(XHRUpload);

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
