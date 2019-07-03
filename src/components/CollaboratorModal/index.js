import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import * as Yup from 'yup';

import {BREAKPOINTS} from '../../utils/constants';
import {ErrorInput, ModalContainer, ModalElem} from '../../utils/content';
import Search from '../../utils/icons/search.svg';
import {
	Button,
	FilterInput,
	Label,
	primaryGrey,
	SubHeading,
} from '../../utils/new/design-system';
import CollaboratorList from '../CollaboratorList';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';

const Actions = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;

	* ~ * {
		margin-left: 2rem;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
		justify-content: flex-start;

		* ~ * {
			margin-left: 0;
			margin-bottom: 0.5rem;
		}
	}
`;

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

const CreateCustomerForm = styled('div')`
	display: grid;
	grid-template-columns: 125px 1fr 1fr;
	grid-column-gap: 20px;

	@media (max-width: ${BREAKPOINTS}px) {
		display: contents;
	}
`;

const CollaboratorModal = ({onDismiss, projectName}) => (
	<ModalContainer onDismiss={onDismiss}>
		<ModalElem>
			<Header>Collaborateur sur le projet {projectName}</Header>
			<Formik
				initialValues={{
					email: '',
				}}
				validate={(values) => {}}
				onSubmit={async (values, actions) => {}}
			>
				{({values, setFieldValue}) => (
					<div>
						<Forms>
							<FilterInput
								icon={Search}
								name="email"
								placeholder="Filtrer par nom, email..."
								type="text"
								onChange={e => setFieldValue(e.target.value)
								}
								value={values.email}
							/>
							<Actions>
								<Button big>
											Ajouter un collaborateur
								</Button>
							</Actions>
						</Forms>
						<CollaboratorList
							collaborators={[
								{
									email: 'francois.poizat@gmail.com',
									name: 'zboub',
									collaborationStatus:
												'COLLABORATION_ACCEPTED',
								},
								{
									email: 'barack@obama.org',
									name: '2zboub',
									collaborationStatus:
												'WAITING_FOR_CONFIRMATION',
								},
								{
									email: 'donald@trump.com',
									name: '3zboub',
									collaborationStatus:
												'COLLABORATION_REJECTED',
								},
							]}
						/>
					</div>
				)}
			</Formik>
		</ModalElem>
	</ModalContainer>
);

export default CollaboratorModal;
