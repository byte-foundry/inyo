import React, {useState} from 'react';
import {Formik} from 'formik';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';

import FormElem from '../FormElem';
import FormSelect from '../FormSelect';
import FormRadiosList from '../FormRadiosList';

import {GET_ALL_PROJECTS, GET_ALL_CUSTOMERS} from '../../utils/queries';
import {SubHeading, Button} from '../../utils/new/design-system';
import {ReactComponent as EyeIcon} from '../../utils/icons/eye.svg';
import {ReactComponent as AddIcon} from '../../utils/icons/add-circle.svg';
import {templates} from '../../utils/project-templates';
import {ModalContainer, ModalElem, ModalActions} from '../../utils/content';

const FormSubHeading = styled(SubHeading)`
	margin-bottom: 2rem;
`;

const CreateProjectRow = styled('div')`
	display: flex;
	margin-top: 1rem;
`;

const SeeContentIcon = styled(EyeIcon)`
	vertical-align: middle;
	margin-top: -2px;
	width: 16px;
	margin-right: 10px;
	margin-left: 4px;
`;

const AddCustomerIcon = styled(AddIcon)`
	vertical-align: middle;
	margin-top: -2px;
	width: 16px;
	margin-right: 10px;
	margin-left: 4px;
`;

const CreateProjectElem = styled('div')`
	flex: 1;
	margin-right: 1rem;
	${props => props.center
		&& `
		display: flex;
		align-items: center;
	`}
`;

function CreateProjectModal({onDismiss}) {
	const [addCustomer, setAddCustomer] = useState(false);
	const [addDeadline, setAddDeadline] = useState(false);
	const {loading: loadingCustomers, data: dataCustomers, error} = useQuery(
		GET_ALL_CUSTOMERS,
		{
			suspend: true,
		},
	);
	const {loading: loadingProjects, data: dataProjects} = useQuery(
		GET_ALL_PROJECTS,
		{suspend: true},
	);

	let optionsProjects = [];

	let optionsCustomers = [];

	if (!loadingProjects) {
		optionsProjects = dataProjects.me.projects.map(project => ({
			value: project.id,
			label: project.name,
		}));
	}

	if (!loadingCustomers) {
		optionsCustomers = dataCustomers.me.customers.map(customer => ({
			value: customer.id,
			label: customer.name,
		}));
	}

	return (
		<ModalContainer size="small">
			<ModalElem>
				<FormSubHeading>Créer un nouveau projet</FormSubHeading>
				<Formik
					initialValues={{
						source: 'BLANK',
					}}
				>
					{props => (
						<form>
							<CreateProjectRow>
								<FormElem
									{...props}
									name="name"
									type="text"
									label="Titre du projet"
									placeholder="Ex: Landing page nouvelle collection, etc."
								/>
							</CreateProjectRow>
							<CreateProjectRow>
								<CreateProjectElem>
									<FormRadiosList
										{...props}
										name="source"
										options={[
											{
												id: 'BLANK',
												label: 'Projet vierge',
											},
											{
												id: 'MODELS',
												label: 'Nos modèles',
											},
											{
												id: 'PROJECTS',
												label: 'Vos projets',
											},
										]}
									/>
								</CreateProjectElem>
								{props.values.source === 'MODELS' && (
									<>
										<CreateProjectElem>
											<FormSelect
												{...props}
												name="model"
												label="Titre du modèle"
												options={templates.map(
													template => ({
														value: template.name,
														label: template.label,
													}),
												)}
											/>
										</CreateProjectElem>
										<CreateProjectElem center>
											<Button link>
												<SeeContentIcon />
												<span>Voir le contenu</span>
											</Button>
										</CreateProjectElem>
									</>
								)}
								{props.values.source === 'PROJECTS' && (
									<>
										<CreateProjectElem>
											<FormSelect
												{...props}
												name="model"
												label="Titre du projet"
												options={optionsProjects}
											/>
										</CreateProjectElem>
										<CreateProjectElem center>
											<Button link>
												<SeeContentIcon />
												<span>Voir le contenu</span>
											</Button>
										</CreateProjectElem>
									</>
								)}
							</CreateProjectRow>
							{addCustomer && (
								<CreateProjectRow>
									<CreateProjectElem>
										<FormSelect
											{...props}
											options={optionsCustomers}
											name="customer"
											label="Client principal du projet"
											css="width: 100%;"
										/>
									</CreateProjectElem>
									<CreateProjectElem center>
										<Button link>
											<AddCustomerIcon />
											<span>Créer un nouveau client</span>
										</Button>
									</CreateProjectElem>
								</CreateProjectRow>
							)}
							{addDeadline && (
								<CreateProjectRow>
									<div>Deadline</div>
								</CreateProjectRow>
							)}
							<CreateProjectRow>
								{!addCustomer && (
									<Button
										onClick={(e) => {
											e.preventDefault();
											setAddCustomer(true);
										}}
									>
										Ajouter un client
									</Button>
								)}
								{!addDeadline && (
									<Button
										onClick={(e) => {
											e.preventDefault();
											setAddDeadline(true);
										}}
									>
										Ajouter une deadline
									</Button>
								)}
							</CreateProjectRow>
							<ModalActions>
								<Button link onClick={onDismiss}>
									Annuler
								</Button>
								<Button>Créer le projet</Button>
							</ModalActions>
						</form>
					)}
				</Formik>
			</ModalElem>
		</ModalContainer>
	);
}

export default CreateProjectModal;
