import React from 'react';
import styled from '@emotion/styled';
import {Route, withRouter} from 'react-router-dom';

import TagListForm from '../../../components/TagListForm';
import TasksList from '../Tasks/tasks-lists';

import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import {Button, SubHeading} from '../../../utils/new/design-system';

const ProjectMain = styled('div')`
	min-height: 100vh;
`;

function Tags({location: {state = {}}, history}) {
	return (
		<ProjectMain>
			<Route path="/app/tags" component={TasksList} />
			<Modal
				onDismiss={() => history.push(`/app/tasks${state.prevSearch || ''}`)
				}
			>
				<ModalElem>
					<SubHeading>Liste des tags</SubHeading>
					<TagListForm />
				</ModalElem>
			</Modal>
		</ProjectMain>
	);
}

export default withRouter(Tags);
