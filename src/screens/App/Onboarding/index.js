import styled from '@emotion/styled';
import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';

import OnboardingCalendar from '../../../components/Onboarding/onboarding-calendar';
import OnboardingCustomAssistant from '../../../components/Onboarding/onboarding-custom-assistant';
import OnboardingFirstStep from '../../../components/Onboarding/onboarding-first-step';
import OnboardingSkills from '../../../components/Onboarding/onboarding-skills';
import OnboardingThirdStep from '../../../components/Onboarding/onboarding-third-step';
import {useQuery} from '../../../utils/apollo-hooks';
import {gray20, Loading, signalGreen} from '../../../utils/content';
import {GET_USER_INFOS} from '../../../utils/queries';

const OnboardingMain = styled('div')`
	max-width: 650px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 100px;
`;

const OnboardingProgressBar = styled('div')`
	background: ${gray20};
	position: relative;
	height: 5px;
	width: 100%;
	margin-bottom: 15px;

	&:after {
		position: absolute;
		top: 0;
		left: 0;
		content: ' ';
		width: ${props => props.completionRate || 0}%;
		height: 100%;
		background: ${signalGreen};
		transition: width 0.2s ease;
	}
`;

function Onboarding() {
	const {data, loading} = useQuery(GET_USER_INFOS, {suspend: true});
	const [currentStep, setStep] = useState(0);

	if (loading) return <Loading />;

	const {me} = data;

	function getNextStep() {
		setStep(currentStep + 1);
	}

	function getPreviousStep() {
		setStep(currentStep - 1);
	}

	const steps = [
		OnboardingFirstStep,
		OnboardingCustomAssistant,
		OnboardingCalendar,
		OnboardingSkills,
		OnboardingThirdStep,
	];

	if (currentStep >= steps.length) {
		window.Intercom('trackEvent', 'start-onboarding-project');
		return <Redirect to="/app/dashboard" />;
	}

	const CurrentOnboardingStep = steps[currentStep];

	return (
		<OnboardingMain>
			<OnboardingProgressBar
				completionRate={((currentStep + 1) / steps.length) * 100}
			/>
			<CurrentOnboardingStep
				me={me}
				isFirstStep={currentStep === 0}
				getNextStep={getNextStep}
				getPreviousStep={getPreviousStep}
			/>
		</OnboardingMain>
	);
}

export default Onboarding;
