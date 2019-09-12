import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {gray20} from '../../utils/content';
import illus from '../../utils/images/bermuda-hello-edwige.svg';
import {UPDATE_USER_SETTINGS} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';

const UserDataFormMain = styled('div')``;

const ProfileSection = styled('div')`
	padding: 60px 40px;
	border: 1px solid ${gray20};
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	column-gap: 20px;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		display: block;
		padding: 0;
		border: none;
	}
`;

const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-right: 0;
		margin-bottom: 20px;
	}
`;

const Illus = styled('img')``;

const UserAssistantForm = ({defaultAssistantName, defaultLanguage, done}) => {
	const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS);

	return (
		<UserDataFormMain>
			<Formik
				initialValues={{
					assistantName: defaultAssistantName,
					language: defaultLanguage || 'en',
				}}
				validationSchema={Yup.object().shape({
					language: Yup.string()
						.oneOf(['en', 'fr'])
						.required(
							<fbt project="inyo" desc="required">
								Requis
							</fbt>,
						),
					assistantName: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(true);

					await updateUserSettings({
						variables: {
							settings: values,
						},
					});

					window.Intercom('update', {
						'assistant-name': values.assistantName,
						language: values.language,
					});

					done();

					actions.setSubmitting(false);
				}}
			>
				{props => (
					<form onSubmit={props.handleSubmit}>
						<ProfileSection>
							<Illus src={illus} style={{gridRow: '1 / 3'}} />
							<FormElem
								{...props}
								name="assistantName"
								label={
									<fbt project="inyo" desc="assistant name">
										Nom de l'assistant
									</fbt>
								}
								placeholder="Edwige"
								padded
								required
								style={{gridColumn: '2 / 4'}}
							/>
							<FormSelect
								{...props}
								name="language"
								label={
									<fbt
										project="inyo"
										desc="notification message"
									>
										Langue de l'assistant
									</fbt>
								}
								options={[
									{value: 'en', label: 'English'},
									{value: 'fr', label: 'Français'},
								]}
								style={{gridColumn: '2 / 4'}}
							/>
						</ProfileSection>
						<UpdateButton type="submit" big>
							<fbt project="inyo" desc="update">
								Mettre à jour
							</fbt>
						</UpdateButton>
					</form>
				)}
			</Formik>
		</UserDataFormMain>
	);
};

export default UserAssistantForm;
