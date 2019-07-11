import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {ModalContainer, ModalElem} from '../../utils/content';
import {REQUEST_COLLAB} from '../../utils/mutations';
import {Button, SubHeading} from '../../utils/new/design-system';
import FormElem from '../FormElem';

const Header = styled(SubHeading)`
	margin-bottom: 2rem;
`;

const Buttons = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

const AddCollaboratorModal = ({onDismiss}) => {
	const requestCollab = useMutation(REQUEST_COLLAB);

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Header>Inviter un collaborateur</Header>
				<Formik
					initalValues={{
						email: '',
					}}
					onSubmit={async (values, actions) => {
						actions.setSubmitting(true);

						const ouais = await requestCollab({
							variables: {
								userEmail: values.email,
							},
						});
					}}
				>
					{props => (
						<form onSubmit={props.handleSubmit}>
							<FormElem
								{...props}
								name="email"
								type="text"
								label="Email du collaborateur"
								placeholder="michel@gmail.com"
								required
								big
							/>
							<Buttons>
								<Button>Inviter</Button>
							</Buttons>
						</form>
					)}
				</Formik>
			</ModalElem>
		</ModalContainer>
	);
};

export default AddCollaboratorModal;
