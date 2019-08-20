import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';

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
					assistantName: Yup.string().required('Requis'),
					language: Yup.string()
						.oneOf(['en', 'fr'])
						.required('Requis'),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(true);

					await updateUserSettings({
						variables: {
							settings: values,
						},
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
								label="Nom de l'assistant"
								placeholder="Edwige"
								padded
								required
								style={{gridColumn: '2 / 4'}}
							/>
							<FormSelect
								{...props}
								name="language"
								label="Langue de l'assistant"
								options={[
									{value: 'en', label: 'English'},
									{value: 'fr', label: 'Français'},
								]}
								style={{gridColumn: '2 / 4'}}
							/>
						</ProfileSection>
						<UpdateButton type="submit" big>
							Mettre à jour
						</UpdateButton>
					</form>
				)}
			</Formik>
		</UserDataFormMain>
	);
};

export default UserAssistantForm;
