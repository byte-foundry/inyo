import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {
	Button,
	FlexColumn,
	FlexRow,
	gray50,
	gray70,
	gray80,
	H4,
	P,
	primaryBlue,
	primaryWhite,
} from '../../utils/content';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import FormElem from '../FormElem';

const OnboardingStep = styled('div')`
	width: 100%;
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
	color: ${gray50};
	font-size: 15px;
`;

const DomainCards = styled(FlexRow)`
	flex-wrap: wrap;
`;

const DomainCard = styled('div')`
	margin-bottom: 15px;
	padding: 14px 16px 15px 16px;
	color: ${props => (props.selected ? primaryWhite : gray80)};
	background-color: ${props => (props.selected ? primaryBlue : 'transparent')};
	border: 1px solid ${props => (props.selected ? primaryBlue : gray70)};
	transition: color 0.3s ease, background-color 0.3s ease,
		border-color 0.3s ease;
	cursor: pointer;
	text-align: center;

	box-sizing: border-box;
	width: 32%;
	margin-right: 2%;
	:nth-child(3n) {
		margin-right: 0;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		margin-right: 0;
		width: 100%;
	}
`;

const toggleSelectedItem = (oldSkills, item) => {
	const skills = [...oldSkills];
	const itemIndex = skills.findIndex(e => e === item);

	if (itemIndex === -1) {
		skills.push(item);
	}
	else {
		skills.splice(itemIndex, 1);
	}

	return skills;
};

const OnboardingSecondStep = ({
	me,
	getNextStep,
	getPreviousStep,
	isFirstStep,
}) => {
	const [updateUser] = useMutation(UPDATE_USER_CONSTANTS);

	const SKILLS = [
		'PRINT_DESIGN',
		'WEB_DESIGN',
		'UX_DESIGN',
		'UI_DESIGN',
		'COPYWRITING',
		'VIDEO',
		'ACCOUNTING',
		'PHOTOGRAPHY',
		'MARKETING',
		'FRONT_END_DEVELOPMENT',
		'BACK_END_DEVELOPMENT',
	];

	return (
		<OnboardingStep>
			<StepSubtitle>
				<fbt project="inyo" desc="onboarding second step title">
					Quelles sont les compétences que vous maitrisez ?
				</fbt>
			</StepSubtitle>
			<StepDescription>
				<fbt project="inyo" desc="onboarding second step description">
					Vous pouvez choisir plusieurs options
				</fbt>
			</StepDescription>
			<Formik
				initialValues={{
					skills: me.skills || [],
					other: '',
				}}
				validate={({skills, other}) => {
					const errors = {};

					if (
						skills.find(
							e => e
								=== (
									<fbt project="inyo" desc="other">
										Autre
									</fbt>
								),
						)
						&& !other
					) {
						errors.other = (
							<fbt project="inyo" desc="required">
								Requis
							</fbt>
						);
					}

					return errors;
				}}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					window.Intercom('update', {
						skills: values.skills,
						otherSkill: values.otherSkill,
					});
					const newSkills = values.skills;

					try {
						await updateUser({
							variables: {
								skills: newSkills,
								otherSkill: values.other,
							},
						});

						getNextStep();
					}
					catch (error) {
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: (
								<fbt project="inyo" desc="something went wrong">
									Quelque chose s'est mal passé
								</fbt>
							),
						});
					}
				}}
			>
				{(props) => {
					const {
						values,
						errors,
						setFieldValue,
						handleChange,
						handleBlur,
						handleSubmit,
						touched,
					} = props;

					const otherSkillSelected = values.skills.find(
						e => e
							=== (
								<fbt project="inyo" desc="other">
									Autre
								</fbt>
							),
					);

					return (
						<form onSubmit={handleSubmit}>
							<DomainCards>
								{SKILLS.map(skill => (
									<DomainCard
										selected={values.skills.find(
											e => e === skill,
										)}
										onClick={() => {
											setFieldValue(
												'skills',
												toggleSelectedItem(
													values.skills,
													skill,
												),
											);
										}}
									>
										<fbt
											project="inyo"
											desc="onboarding second step skills"
										>
											<fbt:enum
												enum-range={{
													PRINT_DESIGN:
														'Design Print',
													WEB_DESIGN: 'Design web',
													UX_DESIGN: 'Design UX',
													UI_DESIGN: 'Design UI',
													COPYWRITING: 'Copywriting',
													VIDEO: 'Vidéo',
													ACCOUNTING: 'Comptabilité',
													PHOTOGRAPHY: 'Photographie',
													MARKETING: 'Marketing',
													FRONT_END_DEVELOPMENT:
														'Dev front end',
													BACK_END_DEVELOPMENT:
														'Dev back end',
												}}
												value={skill}
											/>
										</fbt>
									</DomainCard>
								))}
								<DomainCard
									selected={otherSkillSelected}
									onClick={() => {
										setFieldValue(
											'skills',
											toggleSelectedItem(
												values.skills,
												<fbt
													project="inyo"
													desc="other"
												>
													Autre
												</fbt>,
											),
										);
									}}
								>
									<fbt project="inyo" desc="other">
										Autre
									</fbt>
								</DomainCard>
								{otherSkillSelected && (
									<FormElem
										label={
											<fbt
												project="inyo"
												desc="onboarding second step more information"
											>
												Donnez nous un exemple :)
											</fbt>
										}
										errors={errors}
										required
										values={values}
										type="text"
										touched={touched}
										name="other"
										id="other"
										handleBlur={handleBlur}
										handleChange={handleChange}
									/>
								)}
							</DomainCards>
							<ActionButtons>
								<ActionButton
									theme="Primary"
									size="Medium"
									type="submit"
								>
									<fbt
										project="inyo"
										desc="onboarding second step confirm"
									>
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
						</form>
					);
				}}
			</Formik>
		</OnboardingStep>
	);
};

export default OnboardingSecondStep;
