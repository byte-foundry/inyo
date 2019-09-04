import {Formik} from 'formik';
import React, {useState} from 'react';
import {useApolloClient, useMutation, useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {ModalContainer, ModalElem} from '../../utils/content';
import {CREATE_PROJECT} from '../../utils/mutations';
import {templates} from '../../utils/project-templates';
import {GET_ALL_PROJECTS, GET_PROJECT_DATA} from '../../utils/queries';
import CreateProjectModalForm from '../CreateProjectModalForm';
import CreateProjectModalViewContent from '../CreateProjectModalViewContent';
import CustomerModalAndMail from '../CustomerModalAndMail';

function CreateProjectModal({onDismiss, history, baseName}) {
	const language = (navigator.language || 'fr-FR').split('-')[0];
	const [viewContent, setViewContent] = useState(null);
	const [createCustomer, setCreateCustomer] = useState(false);
	const [customerName, setCustomerName] = useState('');
	const [createProject] = useMutation(CREATE_PROJECT);
	const client = useApolloClient();

	const {data: dataProjects} = useQuery(GET_ALL_PROJECTS, {suspend: true});

	const optionsProjects = dataProjects.me.projects
		.filter(project => project.status !== 'REMOVED')
		.map(project => ({
			value: project.id,
			label: project.name,
		}));

	return (
		<Formik
			initialValues={{
				template: 'BLANK',
				name: baseName,
			}}
			validateSchema={Yup.object({
				name: Yup.string().required(
					<fbt project="inyo" desc="required">
						Requis
					</fbt>,
				),
			})}
			onSubmit={async (
				{
					template, customerId, deadline, name,
				},
				actions,
			) => {
				actions.setSubmitting(true);

				let sections;

				let isModelTemplate = false;

				if (template !== 'EMPTY') {
					const sourceTemplate = templates[language].find(
						tplt => tplt.name === template,
					);

					if (sourceTemplate) {
						isModelTemplate = true;
						({sections} = sourceTemplate);
					}
					else {
						const {
							data: {project: sourceProject},
						} = await client.query({
							query: GET_PROJECT_DATA,
							variables: {
								projectId: template,
							},
						});

						sections = sourceProject.sections.map(section => ({
							name: section.name,
							items: section.items.map(
								({
									name: itemName,
									unit,
									description,
									type,
									timeItTook,
								}) => ({
									name: itemName,
									unit: timeItTook || unit || 0,
									description,
									type,
								}),
							),
						}));
					}
				}

				const {data} = await createProject({
					variables: {
						name,
						sections,
						customerId,
						deadline,
						template: isModelTemplate ? template : undefined,
					},
				});

				history.push(`/app/tasks?projectId=${data.createProject.id}`);
				actions.setSubmitting(false);
			}}
		>
			{props => (
				<>
					{!createCustomer && (
						<form onSubmit={props.handleSubmit}>
							<ModalContainer onDismiss={onDismiss} size="small">
								<ModalElem>
									<CreateProjectModalForm
										{...props}
										setViewContent={setViewContent}
										setCreateCustomer={setCreateCustomer}
										onDismiss={onDismiss}
										setCustomerName={setCustomerName}
										optionsProjects={optionsProjects}
									/>
								</ModalElem>
								{viewContent && viewContent !== 'EMPTY' && (
									<CreateProjectModalViewContent
										content={viewContent}
									/>
								)}
							</ModalContainer>
						</form>
					)}
					{createCustomer && (
						<CustomerModalAndMail
							noSelect
							withBack
							customer={{name: customerName}}
							onDismiss={() => {
								setCustomerName('');
								setCreateCustomer(false);
							}}
							onValidate={({id}) => {
								props.setFieldValue('customerId', id);
							}}
						/>
					)}
				</>
			)}
		</Formik>
	);
}

export default withRouter(CreateProjectModal);
