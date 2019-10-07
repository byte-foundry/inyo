import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS, TAG_COLOR_PALETTE} from '../../utils/constants';
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
import {CREATE_TAG, UPDATE_USER_CONSTANTS} from '../../utils/mutations';
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

const OnboardingSkills = ({
	me, getNextStep, getPreviousStep, isFirstStep,
}) => {
	const [updateUser] = useMutation(UPDATE_USER_CONSTANTS);
	const [createTag] = useMutation(CREATE_TAG);

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
						skills.find(e => e === fbt('Autre', 'other'))
						&& !other
					) {
						errors.other = fbt('Requis', 'required');
					}

					return errors;
				}}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					const newSkills = values.skills.filter(
						s => s !== fbt('Autre', 'other'),
					);

					window.Intercom('update', {
						skills: newSkills,
						otherSkill: values.otherSkill,
					});

					try {
						await updateUser({
							variables: {
								skills: newSkills,
								otherSkill: values.other,
							},
						});

						const getPaletteColor = index => TAG_COLOR_PALETTE[
							index % TAG_COLOR_PALETTE.length
						].map(
							color => `#${color
								.map(p => p.toString(16).padStart(2, '0'))
								.join('')}`,
						);

						const defaultsTagsPromises = [
							createTag({
								variables: {
									name: fbt(
										'Admin',
										'default tag name admin',
									),
									colorBg: getPaletteColor(0)[0],
									colorText: getPaletteColor(0)[1],
								},
							}),
							createTag({
								variables: {
									name: fbt(
										'Perso',
										'default tag name perso',
									),
									colorBg: getPaletteColor(1)[0],
									colorText: getPaletteColor(1)[1],
								},
							}),
						];

						await Promise.all([
							...defaultsTagsPromises,
							...newSkills.map((skill, index) => createTag({
								variables: {
									name: fbt(
										fbt.enum(skill, {
											PRINT_DESIGN: 'Design Print',
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
										}),
										'onboarding second step skills',
									),
									colorBg: getPaletteColor(
										defaultsTagsPromises.length + index,
									)[0],
									colorText: getPaletteColor(
										defaultsTagsPromises.length + index,
									)[1],
								},
							})),
						]);

						getNextStep();
					}
					catch (error) {
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: fbt(
								"Quelque chose s'est mal passé",
								'something went wrong',
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
						e => e === fbt('Autre', 'other'),
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
												fbt('Autre', 'other'),
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

export default OnboardingSkills;
