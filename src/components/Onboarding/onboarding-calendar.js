import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {
	Button,
	FlexColumn,
	FlexRow,
	gray70,
	gray80,
	H4,
	P,
	primaryBlue,
	primaryWhite,
} from '../../utils/content';
import calendarIllus from '../../utils/images/bermuda-calendar.svg';
import useAccount from '../../utils/useAccount';

const OnboardingStep = styled('div')`
	width: 100%;
	display: flex;
	flex-direction: column;
`;
const ActionButtons = styled(FlexColumn)`
	margin-left: auto;
	margin-right: auto;
`;

const ActionButton = styled(Button)`
	width: 200px;
	margin-top: 15px;
	margin-left: auto;
	margin-right: auto;
`;

const StepSubtitle = styled(H4)`
	text-align: center;
`;

const StepDescription = styled(P)`
	text-align: center;
	color: ${gray70};
	font-size: 15px;
`;

const UseCaseCards = styled(FlexRow)`
	flex-wrap: nowrap;
`;

const UseCaseCard = styled('div')`
	flex: 1;
	margin-bottom: 15px;
	padding: 14px 16px 15px 16px;
	color: ${props => (props.selected ? primaryWhite : gray80)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;

	&:first-child {
		margin-right: 10px;
	}
`;

const Illus = styled('img')`
	height: 250px;
`;

const OnboardingThirdStep = ({
	me,
	getNextStep,
	getPreviousStep,
	isFirstStep,
}) => {
	const [account, signedIn, userInfo] = useAccount();

	return (
		<OnboardingStep>
			<StepSubtitle>
				<fbt project="inyo" desc="onboarding last step title">
					Brancher votre calendrier!
				</fbt>
			</StepSubtitle>
			<Illus src={calendarIllus} />
			<StepDescription>
				<fbt project="inyo" desc="onboarding last step description">
					En branchant votre calendrier vous pourrez juger au mieux de
					votre temps disponible. (Vous pourrez le faire a tout moment
					depuis la page <i>Réglages</i>)
				</fbt>
			</StepDescription>
			{signedIn ? (
				<>
					<P>
						<fbt project="inyo" desc="your connected as">
							Vous êtes connecté en tant que{' '}
							<fbt:param name="email">{userInfo.email}</fbt:param>
						</fbt>
					</P>
				</>
			) : (
				<>
					<Button primary onClick={() => account.signIn()}>
						<fbt project="inyo" desc="sign out of google">
							Connecter un compte google
						</fbt>
					</Button>
				</>
			)}
			<ActionButtons>
				<ActionButton
					theme="Primary"
					size="Medium"
					onClick={() => getNextStep()}
				>
					<fbt project="inyo" desc="onboarding last step confirm">
						Continuer
					</fbt>
				</ActionButton>
				{!isFirstStep && (
					<ActionButton
						theme="Link"
						size="XSmall"
						onClick={() => {
							getPreviousStep();
						}}
					>
						{'< '}
						<fbt project="inyo" desc="back">
							Retour
						</fbt>
					</ActionButton>
				)}
			</ActionButtons>
		</OnboardingStep>
	);
};

export default OnboardingThirdStep;
