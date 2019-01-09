import React from 'react';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Mutation} from 'react-apollo';

import {START_PROJECT, UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import {ReactComponent as CloseIcon} from '../../utils/icons/close.svg';

import {
	ModalContainer,
	ModalElem,
	ModalCloseIcon,
	H4,
	P,
	Button,
	primaryBlue,
} from '../../utils/content';

const ModalRow = styled('div')`
	padding-left: 20px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const ModalRowHoriz = styled(ModalRow)`
	display: flex;
	justify-content: space-between;
`;

const StartModalTitle = styled(H4)`
	color: ${primaryBlue};
`;

export default function StartProjectConfirmModal({
	startProject,
	projectId,
	askStartProject,
	closeModal,
}) {
	return (
		<ModalContainer size="small">
			<Mutation mutation={START_PROJECT}>
				{startProjectMutation => (
					<Mutation mutation={UPDATE_USER_CONSTANTS}>
						{updateUser => (
							<Formik
								initialValues={{
									neverAskMeStartProjectConfirmation: !askStartProject,
								}}
								validationSchema={Yup.object().shape({
									neverAskMeStartProjectConfirmation: Yup.boolean(),
								})}
								onSubmit={(values) => {
									updateUser({
										variables: {
											settings: {
												askStartProjectConfirmation: true,
											},
										},
										update: (
											cache,
											{data: {updateUser: updatedUser}},
										) => {
											let data;
											let updateCache = true;

											try {
												data = cache.readQuery({
													query: GET_USER_INFOS,
												});
											}
											catch (e) {
												updateCache = false;
											}

											if (updateCache) {
												if (
													data.me
													&& data.me.settings
												) {
													data.me.settings.askStartProjectConfirmation
														= updatedUser.settings.askStartProjectConfirmation;
												}
												cache.writeQuery({
													query: GET_USER_INFOS,
													data,
												});
											}

											startProject(
												projectId,
												startProjectMutation,
												values.notifyCustomer,
											);
										},
									});
								}}
							>
								{(props) => {
									const {
										isSubmitting,
										handleSubmit,
										setFieldValue,
										submitForm,
									} = props;

									return (
										<ModalElem>
											<ModalCloseIcon>
												<CloseIcon
													onClick={closeModal}
												/>
											</ModalCloseIcon>
											<form onSubmit={handleSubmit}>
												<ModalRow>
													<StartModalTitle>
														C'est parti !
													</StartModalTitle>
													<P>
														Vous vous apprêtez à
														lancer un nouveau
														projet. Nous allons
														envoyer un email à votre
														client pour le notifier
														du lancement.
													</P>
													<P>
														Pour tenir votre client
														au courant de
														l'évolution du projet un
														email sera envoyé quand
														vous finirez une tâche
														du projet.
													</P>
													<P>
														Vous serez notifié au
														début de chaque projet.
													</P>
												</ModalRow>
												<ModalRowHoriz>
													<Button
														theme="Link"
														tabindex="-1"
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															setFieldValue(
																'notifyCustomer',
																false,
															);
															submitForm();
														}}
													>
														Ne pas envoyer d'email
													</Button>
													<Button
														theme="Primary"
														type="submit"
														tabindex="-1"
														disabled={isSubmitting}
													>
														Commencer et envoyer un
														email
													</Button>
												</ModalRowHoriz>
											</form>
										</ModalElem>
									);
								}}
							</Formik>
						)}
					</Mutation>
				)}
			</Mutation>
		</ModalContainer>
	);
}
