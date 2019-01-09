import React from 'react';
import {Formik} from 'formik';
import styled from 'react-emotion';
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
	FlexRow,
	ErrorInput,
	Label,
	Loading,
	Input,
} from '../../../utils/content';
import FormElem from '../../../components/FormElem';
import FormSelect from '../../../components/FormSelect';
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

const DateInput = styled(Input)`
	background: ${primaryWhite};
	border-color: ${primaryBlue};
	border-left: 0px;
	color: ${primaryNavyBlue};
	margin-right: 10px;
	padding: 18px 5px;
	&:focus {
		outline: none;
	}
`;

const SpanLabel = styled('span')`
	background: ${primaryWhite};
	color: ${primaryNavyBlue};
	border: 1px solid ${primaryBlue};
	border-right: 0px;
	padding: 15px 0px 12px 18px;
`;

const SelectStyles = {
	option: base => ({
		...base,
		borderRadius: 0,
		fontFamily: 'Montserrat',
	}),
	menu: base => ({
		...base,
		marginTop: 2,
		borderRadius: 0,
		fontFamily: 'Montserrat',
	}),
	control: base => ({
		...base,
		width: '30vw',
		maxWidth: '500px',
		borderRadius: 0,
		fontFamily: 'Montserrat',
		marginBottom: '10px',
	}),
	input: base => ({
		...base,
		fontFamily: 'Montserrat',
		marginTop: '5px',
	}),
};

const WEEKDAYS_SHORT = {
	fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
};

const MONTHS = {
	fr: [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	],
};

const WEEKDAYS_LONG = {
	fr: [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Smedi',
	],
};

const FIRST_DAY_OF_WEEK = {
	fr: 1,
};
// Translate aria-labels
const LABELS = {
	fr: {nextMonth: 'Mois suivant', previousMonth: 'Mois précédent'},
};

const projectTemplates = templates.map(template => ({
	value: template.name,
	label: template.label,
}));

const formatDate = dateObject => new Date(dateObject).toLocaleDateString('fr-FR');

const parseDate = (dateString) => {
	const dates = dateString.split('/');

	return new Date(`${dates[1]}/${dates[0]}/${dates[2]}`);
};

class CreateProjectForm extends React.Component {
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
													customer: '',
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
														'Requis',
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

													if (
														values.customer
														&& values.customer.label
													) {
														const selectedCustomer
															= values.customer
															&& customers.find(
																c => c.id
																	=== values
																		.customer
																		.id,
															);
														const newCustomer
															= !selectedCustomer
															&& values.customer;

														if (newCustomer) {
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
														}
													}
													else {
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
																		{((selectedCustomer
																			&& values.customer)
																			|| (!selectedCustomer
																				&& !values.customer)) && (
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
																					styles={
																						SelectStyles
																					}
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
																		{!selectedCustomer
																			&& !values.customer && (
																			<div
																			>
																				<br />
																				<Button
																					theme="Primary"
																					onClick={() => setFieldValue(
																						'customer',
																						{},
																					)
																					}
																				>
																						Je
																						crée
																						un
																						nouveau
																						client
																				</Button>
																			</div>
																		)}
																		{!selectedCustomer
																			&& values.customer && (
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
																					styles={
																						SelectStyles
																					}
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
