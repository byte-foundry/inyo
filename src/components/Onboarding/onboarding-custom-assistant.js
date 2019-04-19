import React, {useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {UPDATE_USER_SETTINGS} from '../../utils/mutations';
import {
	H4, P, gray50, Button,
} from '../../utils/content';
import {Input} from '../../utils/new/design-system';

import illus from '../../utils/images/bermuda-hello-edwige.svg';

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
	display: flex;
	flex-direction: horizontal;
`;

const NameInput = styled(Input)`
	background: white;
	border-radius: 0;
	padding: 0.7rem 1rem;
	flex: 1;
	border: 1px solid ${gray50};
	margin-right: 1rem;
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
	const updateUserSettings = useMutation(UPDATE_USER_SETTINGS);
	const [assistantName, setAssistantName] = useState('Edwige');

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

			<Form
				onSubmit={async (e) => {
					e.preventDefault();

					await updateUserSettings({
						variables: {
							settings: {assistantName},
						},
					});

					getNextStep();
				}}
			>
				<NameInput
					big
					type="text"
					placeholder="Edwige"
					name="name"
					onChange={(e) => {
						setAssistantName(e.target.value);
					}}
					value={assistantName}
				/>

				<ActionButton type="submit" theme="Primary" size="Medium">
					Valider
				</ActionButton>
			</Form>

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
