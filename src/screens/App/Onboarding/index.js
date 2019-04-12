import React, {useState} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import {Redirect, withRouter} from 'react-router-dom';
import OnboardingFirstStep from '../../../components/Onboarding/onboarding-first-step';
import OnboardingSecondStep from '../../../components/Onboarding/onboarding-second-step';
import OnboardingThirdStep from '../../../components/Onboarding/onboarding-third-step';
import {GET_USER_INFOS} from '../../../utils/queries';

import {gray20, signalGreen, Loading} from '../../../utils/content';

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

function Onboarding({history}) {
	const {data, loading} = useQuery(GET_USER_INFOS, {suspend: true});
	const [step, setStep] = useState(1);

	if (loading) return <Loading />;

	const {me} = data;

	function getNextStep() {
		setStep(step + 1);
	}

	function getPreviousStep() {
		setStep(step - 1);
	}

	function getStepData(stepId, meData) {
		switch (stepId) {
		case 0:
			return <Redirect to="/auth" />;
		case 1:
			return (
				<OnboardingFirstStep
					me={meData}
					step={stepId}
					getNextStep={getNextStep}
					getPreviousStep={getPreviousStep}
				/>
			);
		case 2:
			return (
				<OnboardingSecondStep
					me={meData}
					step={stepId}
					getNextStep={getNextStep}
					getPreviousStep={getPreviousStep}
				/>
			);
		case 3:
			return (
				<OnboardingThirdStep
					me={meData}
					step={stepId}
					getNextStep={getNextStep}
					getPreviousStep={getPreviousStep}
				/>
			);
		case 4:
			window.Intercom('trackEvent', 'start-onboarding-project');
			history.push('/app/tasks?openModal=true');
			return false;
		default:
			return false;
		}
	}

	return (
		<OnboardingMain>
			<OnboardingProgressBar completionRate={((step - 1) / 3) * 100} />
			{getStepData(step, me)}
		</OnboardingMain>
	);
}

export default withRouter(Onboarding);
