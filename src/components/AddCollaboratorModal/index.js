import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
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
				<Header>
					<fbt project="inyo" desc="header collaborator modal">
						Inviter un collaborateur
					</fbt>
				</Header>
				<Formik
					initalValues={{
						email: '',
					}}
					validationSchema={Yup.object().shape({
						email: Yup.string()
							.email(
								<fbt
									project="inyo"
									desc="error collaborator email not valid"
								>
									L'email doit être valide
								</fbt>,
							)
							.required(
								<fbt
									project="inyo"
									desc="error collaborator email required"
								>
									Requis
								</fbt>,
							),
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
									msg: (
										<fbt
											project="inyo"
											desc="error collaborator user not signed up"
										>
											Cette utilisateur n'est pas encore
											inscrit sur Inyo
										</fbt>
									),
								});
							}
							else if (
								e.graphQLErrors[0].extensions.code
								=== 'AlreadyExisting'
							) {
								actions.setStatus({
									msg: (
										<fbt
											project="inyo"
											desc="error collaborator user already existing"
										>
											Cet utilisateur est déjà un de vos
											collaborateur ou une requête est
											déjà en cours.
										</fbt>
									),
								});
							}
							else {
								actions.setStatus({
									msg: (
										<fbt
											project="inyo"
											desc="error collaborator unspecified error"
										>
											Une erreur s'est produite
										</fbt>
									),
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
								label={
									<fbt
										project="inyo"
										desc="label collaborator email"
									>
										Email du collaborateur
									</fbt>
								}
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
								<Button>
									<fbt
										project="inyo"
										desc="label collaborator invite button"
									>
										Inviter
									</fbt>
								</Button>
							</Buttons>
						</form>
					)}
				</Formik>
			</ModalElem>
		</ModalContainer>
	);
};

export default AddCollaboratorModal;
