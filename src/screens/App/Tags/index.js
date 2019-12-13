import React from 'react';
import {Route, withRouter} from 'react-router-dom';

import TagListForm from '../../../components/TagListForm';
import fbt from '../../../fbt/fbt.macro';
import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import {SubHeading} from '../../../utils/new/design-system';
import Dashboard from '../Dashboard';
import TasksList from '../Tasks/tasks-lists';

function Tags({location: {state = {}}, history}) {
	const Background
		= state.prevLocation && state.prevLocation.pathname.includes('tasks')
			? TasksList
			: Dashboard;
	const prevLocation = state.prevLocation || {pathname: '/app/dashboard'};

	return (
		<>
			<Route path="/app/tags" render={args => <Background {...args} />} />
			<Modal onDismiss={() => history.push(prevLocation)}>
				<ModalElem>
					<SubHeading>
						<fbt project="inyo" desc="tag list">
							Liste des tags
						</fbt>
					</SubHeading>
					<TagListForm />
				</ModalElem>
			</Modal>
		</>
	);
}

export default withRouter(Tags);
