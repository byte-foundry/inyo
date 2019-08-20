import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';

import {
	Button, gray50, H4, P,
} from '../../utils/content';
import illus from '../../utils/images/bermuda-hello-edwige.svg';
import {UPDATE_USER_SETTINGS} from '../../utils/mutations';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';

const OnboardingStep = styled('div')`
	display: flex;
	flex-direction: column;
`;

const StepSubtitle = styled(H4)`
	text-align: center;
`;

const StepDescription = styled(P)`
	text-align: center;
	color: ${gray50};
	font-size: 15px;
`;

const Illus = styled('img')`
	height: 250px;
`;

const Form = styled('form')`
	display: grid;
	grid-template-columns: 2fr 1fr;
	column-gap: 20px;
`;

const ActionButton = styled(Button)`
	width: 200px;
	margin: auto;
`;

const OnboardingCustomAssistant = ({
	me,
	getNextStep,
	getPreviousStep,
	isFirstStep,
}) => {
	const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS);

	return (
		<OnboardingStep>
			<StepSubtitle>
				Comment souhaitez-vous appeler
				<br />
				votre assistant·e ?
			</StepSubtitle>

			<Illus src={illus} />

			<StepDescription>
				Lorsque nous notifierons vos clients d'une tâche à réaliser,
				d'un commentaire, etc. ce sera le prénom utilisé pour signer les
				emails.
			</StepDescription>

			<Formik
				initialValues={{
					assistantName: me.settings.assistantName || 'Edwige',
					language: me.settings.language || 'en',
				}}
				validationSchema={Yup.object().shape({
					assistantName: Yup.string().required('Requis'),
					language: Yup.string()
						.oneOf(['en', 'fr'])
						.required('Requis'),
				})}
				onSubmit={async (values, {setSubmitting, setErrors}) => {
					setSubmitting(true);

					try {
						await updateUserSettings({
							variables: {
								settings: values,
							},
						});

						getNextStep();
					}
					catch (e) {
						setErrors(e);
					}

					setSubmitting(false);
				}}
			>
				{props => (
					<Form onSubmit={props.handleSubmit}>
						<FormElem
							{...props}
							name="assistantName"
							label="Nom de l'assistant"
							placeholder="Edwige"
							padded
							required
						/>
						<FormSelect
							{...props}
							name="language"
							label="Langue de l'assistant"
							options={[
								{value: 'en', label: 'English'},
								{value: 'fr', label: 'Français'},
							]}
							style={{marginBottom: '20px'}}
						/>
						<ActionButton
							type="submit"
							style={{gridColumn: '1 / 3'}}
							theme="Primary"
							size="Medium"
						>
							Valider
						</ActionButton>
					</Form>
				)}
			</Formik>

			{!isFirstStep && (
				<ActionButton theme="Link" onClick={getPreviousStep}>
					{'< '}
					Retour
				</ActionButton>
			)}
		</OnboardingStep>
	);
};

export default OnboardingCustomAssistant;
