import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
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
				<fbt project="inyo" desc="onboarding assistant title 1st">
					Comment souhaitez-vous appeler
				</fbt>
				<br />
				<fbt project="inyo" desc="onboarding assistant title 2nd">
					votre assistant·e ?
				</fbt>
			</StepSubtitle>

			<Illus src={illus} />

			<StepDescription>
				<fbt project="inyo" desc="onboarding assistant description">
					Lorsque nous notifierons vos clients d'une tâche à réaliser,
					d'un commentaire, etc. ce sera le prénom utilisé pour signer
					les emails.
				</fbt>
			</StepDescription>

			<Formik
				initialValues={{
					assistantName: me.settings.assistantName || 'Edwige',
					language: me.settings.language || 'en',
				}}
				validationSchema={Yup.object().shape({
					assistantName: Yup.string().required(
						fbt('Requis', 'required'),
					),
					language: Yup.string()
						.oneOf(['en', 'fr'])
						.required(fbt('Requis', 'required')),
				})}
				onSubmit={async (values, {setSubmitting, setErrors}) => {
					setSubmitting(true);

					try {
						await updateUserSettings({
							variables: {
								settings: values,
							},
						});

						window.Intercom('update', {
							'assistant-name': values.assistantName,
							language: values.language,
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
							label={
								<fbt project="inyo" desc="assitant language">
									Langue de l'assistant
								</fbt>
							}
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
							<fbt
								project="inyo"
								desc="confirm onboarding assistant"
							>
								Valider
							</fbt>
						</ActionButton>
					</Form>
				)}
			</Formik>

			{!isFirstStep && (
				<ActionButton theme="Link" onClick={getPreviousStep}>
					{'< '}
					<fbt project="inyo" desc="back onboarding assistant">
						Retour
					</fbt>
				</ActionButton>
			)}
		</OnboardingStep>
	);
};

export default OnboardingCustomAssistant;
