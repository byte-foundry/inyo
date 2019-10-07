import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {ModalContainer, ModalElem} from '../../utils/content';
import Search from '../../utils/icons/search.svg';
import {FilterInput, SubHeading} from '../../utils/new/design-system';
import {GET_USER_COLLABORATORS} from '../../utils/queries';
import CollaboratorList from '../CollaboratorList';

const Forms = styled('div')`
	display: flex;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin-bottom: 2rem;
	}
`;

const Header = styled(SubHeading)`
	margin-bottom: 2rem;
`;

const BetterFilterInput = styled(FilterInput)`
	margin: 0;
`;

const CollaboratorModal = ({
	onDismiss,
	projectName,
	projectId,
	linkedCollaborators,
}) => {
	const {
		data: {
			me: {collaborators},
		},
		errors,
	} = useQuery(GET_USER_COLLABORATORS, {suspend: true});

	if (errors) throw errors;

	const collaboratorsWithLink = collaborators.map(collaborator => ({
		collaborator,
		isLinked: linkedCollaborators.find(
			linkedTo => collaborator.id === linkedTo.id,
		),
	}));

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Header>
					<fbt project="inyo" desc="collaborators modal header">
						Collaborateurs sur le projet{' '}
						<fbt:param name="projectName">{projectName}</fbt:param>
					</fbt>
				</Header>
				<Formik
					initialValues={{
						search: '',
					}}
					validate={(values) => {}}
					onSubmit={async (values, actions) => {}}
				>
					{({values, setFieldValue}) => {
						const filteredCollaborators = collaboratorsWithLink.filter(
							c => c.collaborator.email.includes(values.search)
								|| c.collaborator.firstName.includes(
									values.search,
								)
								|| c.collaborator.lastName.includes(values.search),
						);

						return (
							<div>
								<Forms>
									<BetterFilterInput
										icon={Search}
										name="search"
										placeholder={
											<fbt
												project="inyo"
												desc="filter collaborator by email placeholder"
											>
												Filtrer par nom, email...
											</fbt>
										}
										type="text"
										onChange={e => setFieldValue(
											'search',
											e.target.value,
										)
										}
										value={values.search}
									/>
									<Link to="/app/collaborators">
										<fbt
											project="inyo"
											desc="collaborator modal invite link"
										>
											Inviter un nouveau collaborateur
										</fbt>
									</Link>
								</Forms>
								<CollaboratorList
									collaborators={filteredCollaborators}
									projectId={projectId}
								/>
							</div>
						);
					}}
				</Formik>
			</ModalElem>
		</ModalContainer>
	);
};

export default CollaboratorModal;
