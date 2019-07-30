import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';

import {ErrorInput, ModalContainer, ModalElem} from '../../utils/content';
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
	const [requestCollab] = useMutation(REQUEST_COLLAB);

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Header>Inviter un collaborateur</Header>
				<Formik
					initalValues={{
						email: '',
					}}
					validationSchema={Yup.object().shape({
						email: Yup.string()
							.email("L'email doit être valide")
							.required('Requis'),
					})}
					onSubmit={async (values, actions) => {
						actions.setSubmitting(true);

						try {
							await requestCollab({
								variables: {
									userEmail: values.email,
								},
							});

							onDismiss();
						}
						catch (e) {
							actions.setSubmitting(false);
							actions.setErrors(e);
							if (
								e.graphQLErrors[0].extensions.code
								=== 'NotFound'
							) {
								actions.setStatus({
									msg:
										"Cet utilisateur n'est pas encore inscrit sur Inyo.",
								});
							}
							else if (
								e.graphQLErrors[0].extensions.code
								=== 'AlreadyExisting'
							) {
								actions.setStatus({
									msg:
										'Cet utilisateur est déjà un de vos collaborateur ou une requête est déjà en cours.',
								});
							}
							else {
								actions.setStatus({
									msg: "Une erreur s'est produite.",
								});
							}
						}
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
							{props.status && props.status.msg && (
								<ErrorInput style={{marginBottom: '1rem'}}>
									{props.status.msg}
								</ErrorInput>
							)}
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
