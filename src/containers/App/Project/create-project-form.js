import React from 'react';
import {Formik} from 'formik';
import styled from '@emotion/styled';
import {Mutation, Query} from 'react-apollo';
import Creatable from 'react-select/lib/Creatable';
import {withRouter} from 'react-router-dom';
import * as Yup from 'yup';
import ClassicSelect from 'react-select';
import ReactGA from 'react-ga';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import * as Sentry from '@sentry/browser';

import {templates} from '../../../utils/project-templates';

import {
	H1,
	H3,
	H4,
	Button,
	primaryBlue,
	primaryNavyBlue,
	primaryWhite,
	gray70,
	signalRed,
	FlexRow,
	ErrorInput,
	Label,
	Loading,
	Input,
	DateInput,
} from '../../../utils/content';
import {formatDate, parseDate} from '../../../utils/functions';
import {
	MONTHS,
	WEEKDAYS_LONG,
	WEEKDAYS_SHORT,
	FIRST_DAY_OF_WEEK,
	LABELS,
} from '../../../utils/constants';
import FormElem from '../../../components/FormElem';
import FormSelect from '../../../components/FormSelect';
import FormCheckbox from '../../../components/FormCheckbox';
import {CREATE_PROJECT} from '../../../utils/mutations';
import {
	GET_ALL_PROJECTS,
	GET_USER_INFOS,
	GET_PROJECT_DATA,
} from '../../../utils/queries';

const SubTitle = styled(H3)`
	color: ${primaryBlue};
`;

const FormTitle = styled(H4)`
	color: ${primaryBlue};
`;

const FormSection = styled('div')`
	margin-left: ${props => (props.right ? '40px' : 0)};
	margin-right: ${props => (props.left ? '40px' : 0)};
`;

const InfoPrivacy = styled('div')`
	font-size: 15px;
	background: ${primaryNavyBlue};
	color: ${primaryWhite};
	border-radius: 3px;
	padding: 20px;
	display: flex;

	&:before {
		display: block;
		content: '🔒';
		width: 30px;
		height: 30px;
		align-self: center;
		font-size: 18px;
	}
`;

const SpanLabel = styled('span')`
	background: ${primaryWhite};
	color: ${primaryNavyBlue};
	border: 1px solid ${primaryBlue};
	border-right: 0px;
	padding: 15px 0px 12px 18px;
`;

const ProjectFormCheckboxContainer = styled('div')`
	margin-bottom: 17px;
`;

const SelectStyles = props => ({
	option: base => ({
		...base,
		borderRadius: 0,
		fontFamily: 'Work Sans',
	}),
	menu: base => ({
		...base,
		marginTop: 2,
		borderRadius: 0,
		fontFamily: 'Work Sans',
	}),
	control: base => ({
		...base,
		width: '30vw',
		maxWidth: '500px',
		borderRadius: 0,
		fontFamily: 'Work Sans',
		marginBottom: '10px',
		borderColor: props.error ? signalRed : gray70,
	}),
	valueContainer: base => ({
		padding: '8px 8px',
	}),
	input: base => ({
		...base,
		fontFamily: 'Work Sans',
		marginTop: '5px',
	}),
});

const projectTemplates = templates.map(template => ({
	value: template.name,
	label: template.label,
}));

class CreateProjectForm extends React.Component {
	state = {};

	render() {
		const {
			customers,
			onCreate,
			match: {
				params: {projectId},
			},
		} = this.props;

		return (
			<Query query={GET_USER_INFOS}>
				{({loading, data, error}) => {
					if (error) throw error;
					if (loading) return <Loading />;

					return (
						<Query query={GET_PROJECT_DATA} variables={{projectId}}>
							{({
								loading: loadingProject,
								data: dataProject,
								error: errorProject,
							}) => {
								if (errorProject && projectId) {
									throw new Error(errorProject);
								}
								if (loadingProject) return <Loading />;
								if (!dataProject && projectId) return false;

								return (
									<Mutation mutation={CREATE_PROJECT}>
										{createProject => (
											<Formik
												initialValues={{
													customer: {
														label: '',
														value: '',
													},
													notifyActivityToCustomer: true,
													title: '',
													template: '',
													firstName: '',
													lastName: '',
													email: '',
													projectTitle: '',
													phone: '',
													deadline: new Date(),
												}}
												validationSchema={Yup.object({
													customer: Yup.object().required(
														"Un client est requis pour la création d'un projet",
													),
													projectTitle: Yup.string().required(
														'Requis',
													),
													title: Yup.string(),
													firstName: Yup.string(),
													lastName: Yup.string(),
													email: Yup.string().email(
														'Email invalide',
													),
												})}
												validate={(values) => {
													const errors = {};

													const selectedCustomer
														= values.customer
														&& customers.find(
															c => c.id
																=== values.customer
																	.id,
														);

													if (
														this.state.newCustomer
													) {
														if (
															!values.title
															&& !values.firstName
															&& !values.lastName
														) {
															errors.title
																= 'Remplissez au moins civilité, prénom ou nom';
															errors.firstName
																= 'Remplissez au moins civilité, prénom ou nom';
															errors.lastName
																= 'Remplissez au moins civilité, prénom ou nom';
														}
														if (!values.email) {
															errors.email
																= 'Requis';
														}
														if (
															!values.customer
																.label
														) {
															errors.customer = {
																label: 'Requis',
															};
														}
													}
													else if (
														!selectedCustomer
													) {
														errors.customer
															= 'Requis';
													}

													if (
														!values.template
														&& !projectId
													) {
														errors.template
															= 'Requis';
													}
													else if (
														values.template
															!== 'WEBSITE'
														&& values.template
															!== 'IDENTITY'
														&& values.template
															!== 'BLANK'
														&& !projectId
													) {
														errors.template
															= 'Template invalide';
													}
													return errors;
												}}
												onSubmit={async (
													values,
													actions,
												) => {
													actions.setSubmitting(true);
													const customer = customers.find(
														c => c.id
															=== values.customer.id,
													);

													const variables = {
														template: dataProject
															? 'BLANK'
															: values.template,
														name:
															values.projectTitle,
														deadline: values.deadline.toISOString(),
														notifyActivityToCustomer:
															values.notifyActivityToCustomer,
													};

													if (customer) {
														variables.customerId
															= customer.id;
													}
													else {
														variables.customer = {
															name:
																values.customer
																	.value
																|| values.customer
																	.label,
															firstName:
																values.firstName,
															lastName:
																values.lastName,
															email: values.email,
															title: values.title,
															phone: values.phone,
														};
													}

													const selectedTemplate = templates.find(
														t => t.name
															=== values.template,
													);
													let sections = [];

													if (selectedTemplate) {
														({
															sections,
														} = selectedTemplate);
													}

													if (dataProject) {
														const newSections = dataProject.project.sections.map(
															section => ({
																...section,
																items: section.items.map(
																	item => ({
																		...item,
																		status: undefined,
																		comments: undefined,
																		id: undefined,
																		__typename: undefined,
																		position: undefined,
																	}),
																),
																__typename: undefined,
																id: undefined,
															}),
														);

														sections = newSections;
													}

													variables.sections = sections;
													try {
														const result = await createProject(
															{
																variables,
																refetchQueries: [
																	'userCustomersQuery',
																	'getAllProjectsQuery',
																],
																update: (
																	cache,
																	{
																		data: {
																			createProject: createdProject,
																		},
																	},
																) => {
																	const projectsResults = cache.readQuery(
																		{
																			query: GET_ALL_PROJECTS,
																		},
																	);

																	projectsResults.me.company.projects.push(
																		createdProject,
																	);

																	cache.writeQuery(
																		{
																			query: GET_ALL_PROJECTS,
																			projectsResults,
																		},
																	);
																	ReactGA.event(
																		{
																			category:
																				'Project',
																			action:
																				'Created project',
																		},
																	);
																	window.$crisp.push(
																		[
																			'set',
																			'session:event',
																			[
																				[
																					[
																						'project_created',
																						{
																							template:
																								values.template,
																						},
																						'blue',
																					],
																				],
																			],
																		],
																	);
																	const projectNumber = window.$crisp.get(
																		'session:data',
																		'project_count',
																	);

																	if (
																		projectNumber
																	) {
																		window.$crisp.push(
																			[
																				'set',
																				'session:data',
																				[
																					[
																						[
																							'project_count',
																							projectNumber
																								+ 1,
																						],
																					],
																				],
																			],
																		);
																	}
																	else {
																		window.$crisp.push(
																			[
																				'set',
																				'session:data',
																				[
																					[
																						[
																							'project_count',
																							1,
																						],
																					],
																				],
																			],
																		);
																	}
																	if (
																		variables.customer
																	) {
																		window.$crisp.push(
																			[
																				'set',
																				'session:event',
																				[
																					[
																						[
																							'customer_created',
																							undefined,
																							'pink',
																						],
																					],
																				],
																			],
																		);
																		const customerNumber = window.$crisp.get(
																			'session:data',
																			'customer_count',
																		);

																		if (
																			customerNumber
																		) {
																			window.$crisp.push(
																				[
																					'set',
																					'session:data',
																					[
																						[
																							[
																								'customer_count',
																								customerNumber
																									+ 1,
																							],
																						],
																					],
																				],
																			);
																		}
																		else {
																			window.$crisp.push(
																				[
																					'set',
																					'session:data',
																					[
																						[
																							[
																								'customer_count',
																								1,
																							],
																						],
																					],
																				],
																			);
																		}
																		ReactGA.event(
																			{
																				category:
																					'Customer',
																				action:
																					'Created customer',
																			},
																		);
																	}
																},
															},
														);

														onCreate(
															result.data
																.createProject,
														);
														actions.setSubmitting(
															false,
														);
													}
													catch (projectError) {
														if (
															projectError.networkError
															&& projectError
																.networkError
																.result
															&& projectError
																.networkError
																.result.errors
														) {
															Sentry.captureException(
																projectError
																	.networkError
																	.result
																	.errors,
															);
														}
														else {
															Sentry.captureException(
																projectError,
															);
														}
														actions.setSubmitting(
															false,
														);
														actions.setErrors(
															projectError,
														);
														actions.setStatus({
															msg: `Quelque chose ne s'est pas passé comme prévu. ${projectError}`,
														});
													}
												}}
											>
												{(props) => {
													const {
														values,
														setFieldValue,
														status,
														isSubmitting,
														errors,
														touched,
													} = props;
													const selectedCustomer
														= values.customer
														&& customers.find(
															c => c.id
																=== values.customer
																	.id,
														);

													return (
														<div>
															<form
																onSubmit={
																	props.handleSubmit
																}
															>
																<FlexRow>
																	<FormSection
																		left
																	>
																		{!this
																			.state
																			.newCustomer && (
																			<>
																				<SubTitle
																				>
																					1.
																					Votre
																					client
																				</SubTitle>
																				<Label
																					required
																				>
																					Entrez
																					le
																					nom
																					de
																					l'entreprise
																					de
																					votre
																					client
																				</Label>
																				<Creatable
																					id="customer"
																					name="customer"
																					options={customers.map(
																						customer => ({
																							...customer,
																							label:
																								customer.name,
																							value:
																								customer.id,
																						}),
																					)}
																					getOptionValue={option => option.id
																					}
																					onChange={(option) => {
																						setFieldValue(
																							'customer',
																							option,
																						);
																					}}
																					styles={SelectStyles(
																						{
																							error:
																								touched.customer
																								&& errors.customer,
																						},
																					)}
																					value={
																						values.customer
																					}
																					isClearable
																					placeholder="Dubois SARL"
																					formatCreateLabel={inputValue => `Créer "${inputValue}"`
																					}
																				/>
																				{errors.customer
																					&& touched.customer && (
																					<ErrorInput
																					>
																						{
																							errors.customer
																						}
																					</ErrorInput>
																				)}
																			</>
																		)}
																		{!this
																			.state
																			.newCustomer && (
																			<div
																			>
																				<br />
																				<Button
																					theme="Primary"
																					onClick={() => {
																						setFieldValue(
																							'customer',
																							{
																								label:
																									'',
																								value:
																									'',
																							},
																						);
																						this.setState(
																							{
																								newCustomer: true,
																							},
																						);
																					}}
																				>
																					Je
																					crée
																					un
																					nouveau
																					client
																				</Button>
																			</div>
																		)}
																		{this
																			.state
																			.newCustomer && (
																			<div
																			>
																				<FormTitle
																				>
																					Création
																					d'un
																					nouveau
																					client
																				</FormTitle>
																				<p
																				>
																					Pourriez-vous
																					nous
																					en
																					dire
																					plus
																					?
																				</p>
																				<InfoPrivacy
																				>
																					Vos
																					données
																					sont
																					les
																					vôtres
																					!
																					<br />
																					Nous
																					ne
																					partageons
																					pas
																					les
																					informations
																					de
																					vos
																					clients.
																				</InfoPrivacy>
																				<FlexRow
																				>
																					<FormElem
																						{...props}
																						label="Nom"
																						type="text"
																						required
																						name="customer.label"
																					/>
																				</FlexRow>
																				<FlexRow
																				>
																					<FormSelect
																						{...props}
																						label="Civilité"
																						name="title"
																						paddedRight
																						options={[
																							{
																								value: undefined,
																								label:
																									'',
																							},
																							{
																								value:
																									'MONSIEUR',
																								label:
																									'M.',
																							},
																							{
																								value:
																									'MADAME',
																								label:
																									'Mme',
																							},
																						]}
																					/>
																					<FormElem
																						{...props}
																						label="Le prénom de votre contact"
																						name="firstName"
																						placeholder="John"
																					/>
																				</FlexRow>
																				<FormElem
																					{...props}
																					label="Le nom de votre contact"
																					name="lastName"
																					placeholder="Doe"
																				/>
																				<FormElem
																					{...props}
																					label="Son email"
																					name="email"
																					placeholder="contact@company.com"
																					required
																				/>
																				<FormElem
																					{...props}
																					label="Son numéro de téléphone"
																					name="phone"
																					placeholder="08 36 65 65 65"
																				/>
																			</div>
																		)}
																	</FormSection>

																	<FormSection
																		right
																	>
																		<SubTitle
																		>
																			2.
																			Votre
																			projet
																		</SubTitle>
																		{projectId && (
																			<Label
																			>
																				Ce
																				projet
																				est
																				créé
																				à
																				partir
																				du
																				projet{' '}
																				<strong
																				>
																					{
																						dataProject
																							.project
																							.name
																					}
																				</strong>{' '}
																				!
																			</Label>
																		)}
																		{!projectId && (
																			<>
																				<Label
																				>
																					Nous
																					pouvons
																					pré-remplir
																					votre
																					projet
																					pour
																					vous
																				</Label>
																				<ClassicSelect
																					styles={SelectStyles(
																						{
																							error:
																								touched.template
																								&& errors.template,
																						},
																					)}
																					defaultValue="WEBSITE"
																					placeholder="Type de projet"
																					onChange={(option) => {
																						setFieldValue(
																							'template',
																							option
																								&& option.value,
																						);
																					}}
																					options={
																						projectTemplates
																					}
																				/>
																				{errors.template
																					&& touched.template && (
																					<ErrorInput
																					>
																						{
																							errors.template
																						}
																					</ErrorInput>
																				)}
																			</>
																		)}
																		<FormElem
																			required
																			{...props}
																			label="Titre de votre projet"
																			name="projectTitle"
																			placeholder="Nom du projet"
																		/>
																		{status
																			&& status.msg && (
																			<ErrorInput
																			>
																				{
																					status.msg
																				}
																			</ErrorInput>
																		)}
																		<ProjectFormCheckboxContainer
																		>
																			<FormCheckbox
																				{...props}
																				label="Notifier mon client par email de l'avancé du projet"
																				name="notifyActivityToCustomer"
																			/>
																		</ProjectFormCheckboxContainer>
																		<FlexRow
																		>
																			<SpanLabel
																			>
																				Finir
																				avant
																				:
																			</SpanLabel>
																			<DayPickerInput
																				formatDate={
																					formatDate
																				}
																				parseDate={
																					parseDate
																				}
																				dayPickerProps={{
																					locale:
																						'fr',
																					months:
																						MONTHS.fr,
																					weekdaysLong:
																						WEEKDAYS_LONG.fr,
																					weekdaysShort:
																						WEEKDAYS_SHORT.fr,
																					firstDayOfWeek:
																						FIRST_DAY_OF_WEEK.fr,
																					labels:
																						LABELS.fr,
																					selectedDays:
																						values.deadline,
																				}}
																				component={dateProps => (
																					<DateInput
																						{...dateProps}
																					/>
																				)}
																				onDayChange={(day) => {
																					setFieldValue(
																						'deadline',
																						day,
																					);
																				}}
																				value={
																					values.deadline
																				}
																			/>
																		</FlexRow>
																		<br />
																		<Button
																			type="submit"
																			theme={
																				isSubmitting
																					? 'Disabled'
																					: 'Primary'
																			}
																			disabled={
																				isSubmitting
																			}
																			size="Large"
																		>
																			Créez
																			votre
																			projet
																		</Button>
																	</FormSection>
																</FlexRow>
															</form>
														</div>
													);
												}}
											</Formik>
										)}
									</Mutation>
								);
							}}
						</Query>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(CreateProjectForm);
