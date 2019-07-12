import styled from '@emotion/styled';
import React from 'react';
import {Route, withRouter} from 'react-router-dom';

import TagListForm from '../../../components/TagListForm';
import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import {SubHeading} from '../../../utils/new/design-system';
import Dashboard from '../Dashboard';

const ProjectMain = styled('div')`
	min-height: 100vh;
`;

function Tags({location: {state = {}}, history}) {
	return (
		<ProjectMain>
			<Route path="/app/tags" component={Dashboard} />
			<Modal
				onDismiss={() => history.push({
					pathname: state.prevLocation.pathname,
					state: {
						prevSearch:
								state.prevLocation.search || state.prevSearch,
					},
				})
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
