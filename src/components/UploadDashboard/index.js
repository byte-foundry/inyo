import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Uppy, {Plugin} from '@uppy/core';
import uppyFrenchLocale from '@uppy/locales/lib/fr_FR';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import {IntlViewerContext} from 'fbt';
import React, {useEffect, useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {Button} from '../../utils/new/design-system';

class Upload extends Plugin {
	constructor(uppy, opts) {
		super(uppy, opts);
		this.id = opts.id || 'graphqlupload';
		this.type = 'GraphQLUpload';

		this.callback = opts.callback;
	}

	install() {
		this.uppy.addUploader((fileIDs) => {
			const files = fileIDs.map(fileID => this.uppy.getFile(fileID).data);

			return this.callback(files);
		});
	}
}

function UploadDashboard({onUploadFiles}) {
	const [modalOpen, setModalOpen] = useState(false);
	const [uppyState] = useState(
		Uppy({
			allowMultipleUploads: true,
			locale:
				IntlViewerContext.locale.startsWith('fr') && uppyFrenchLocale,
		}).use(Upload, {
			callback: onUploadFiles,
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
			/>
		</>
	);
}

UploadDashboard.defaultProps = {
	onUploadFiles: () => {},
};

export default UploadDashboard;
