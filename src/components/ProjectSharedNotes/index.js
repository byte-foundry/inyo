import React, {useState} from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {convertToRaw} from 'draft-js';
import {Editor, createEditorState} from 'medium-draft';
import {BLOCK_BUTTONS} from 'medium-draft/lib/components/toolbar';
import 'medium-draft/lib/index.css';

import {gray20} from '../../utils/content';
import {GET_PROJECT_NOTES} from '../../utils/queries';
import {UPDATE_PROJECT_NOTES} from '../../utils/mutations';

const TasksListContainer = styled('div')`
	margin-top: 3rem;
`;

const TextEditorMain = styled('div')`
	border: 1px solid ${gray20};
	margin: 10px 20px;
	height: 100%;
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

const ProjectSharedNotes = ({projectId, customerToken}) => {
	const {data, error} = useQuery(GET_PROJECT_NOTES, {
		variables: {id: projectId, token: customerToken},
	});
	const updateNotes = useMutation(UPDATE_PROJECT_NOTES);

	if (error) throw error;

	const [editorState, setEditorState] = useState(
		createEditorState(data.project.notes),
	);

	const handleChange = (newState) => {
		updateNotes(convertToRaw(newState.getCurrentContent()));
		setEditorState(newState);
	};

	return (
		<TasksListContainer>
			<TextEditorMain>
				<Editor
					editorEnabled
					editorState={editorState}
					onChange={handleChange}
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
					placeholder="Écrivez des notes..."
				/>
			</TextEditorMain>
		</TasksListContainer>
	);
};

export default ProjectSharedNotes;
