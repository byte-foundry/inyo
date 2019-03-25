import React, {useState, useRef} from 'react';
import styled from '@emotion/styled';
import {convertToRaw} from 'draft-js';
import {Editor, createEditorState} from 'medium-draft';
import {BLOCK_BUTTONS} from 'medium-draft/lib/components/toolbar';
import debounce from 'lodash.debounce';
import 'medium-draft/lib/index.css';

import {gray20} from '../../utils/content';
import {lightPurple, primaryPurple} from '../../utils/new/design-system';

const ProjectNotesContainer = styled('div')`
	flex: 1;
`;

const TasksListContainer = styled('div')`
	margin-top: 1rem;
`;

const TextEditorMain = styled('div')`
	border: 1px solid ${gray20};
	background-color: ${lightPurple};
	height: 100%;
	position: relative;
	z-index: 0;
`;

const EditorToast = styled('div')`
	position: absolute;
	font-weight: 600;
	top: 10px;
	right: 10px;
	color: ${primaryPurple};
`;

BLOCK_BUTTONS.unshift({
	description: 'Heading 1',
	icon: 'header',
	label: 'H1',
	style: 'header-one',
});
BLOCK_BUTTONS.unshift({
	description: 'Heading 2',
	icon: 'header',
	label: 'H2',
	style: 'header-two',
});

const ProjectNotes = ({
	notes,
	customerToken,
	updateNotes,
	projectId,
	children,
}) => {
	const [saved, setSaved] = useState(false);
	const [editorState, setEditorState] = useState(
		createEditorState(Object.keys(notes).length > 0 ? notes : undefined),
	);

	const debounceUpdateNotes = useRef(
		debounce(({notes, id}) => {
			updateNotes({
				variables: {
					notes,
					id,
				},
			});
			setSaved(true);
			setTimeout(() => setSaved(false), 1500);
		}, 2000),
	);

	const handleChange = useRef((newState) => {
		debounceUpdateNotes.current({
			notes: convertToRaw(newState.getCurrentContent()),
			id: projectId,
		});
		setEditorState(newState);
	});

	return (
		<ProjectNotesContainer>
			{children}
			<TasksListContainer>
				<TextEditorMain>
					<Editor
						editorEnabled
						editorState={editorState}
						onChange={handleChange.current}
						sideButtons={[]}
						toolbarConfig={{
							block: [
								'header-one',
								'header-two',
								'header-three',
								'ordered-list-item',
								'unordered-list-item',
								'blockquote',
							],
							inline: [
								'BOLD',
								'ITALIC',
								'UNDERLINE',
								'hyperlink',
								'HIGHLIGHT',
							],
						}}
						placeholder={`Écrivez des notes...
Pour accèder aux options sélectionnez un bout de texte. Vous pouvez aussi utiliser markdown.`}
					/>
					{saved && <EditorToast>Sauvé!</EditorToast>}
				</TextEditorMain>
			</TasksListContainer>
		</ProjectNotesContainer>
	);
};

export default ProjectNotes;
