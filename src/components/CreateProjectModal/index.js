import React, {useState} from 'react';
import {Formik} from 'formik';
import styled from '@emotion/styled';

import FormElem from '../FormElem';
import FormSelect from '../FormSelect';
import FormRadiosList from '../FormRadiosList';

import {SubHeading, Button} from '../../utils/new/design-system';
import {ModalContainer, ModalElem, ModalActions} from '../../utils/content';

const FormSubHeading = styled(SubHeading)`
	margin-bottom: 2rem;
`;

const CreateProjectRow = styled('div')`
	display: flex;
	margin-top: 1rem;
`;

const CreateProjectElem = styled('div')`
	flex: 1;
`;

function CreateProjectModal() {
	const [addCustomer, setAddCustomer] = useState(false);
	const [addDeadline, setAddDeadline] = useState(false);

	return (
		<ModalContainer size="small">
			<ModalElem>
				<FormSubHeading>Créer un nouveau projet</FormSubHeading>
				<Formik>
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
								<CreateProjectElem>
									<FormSelect
										{...props}
										name="model"
										label="Titre du modèle"
										options={[
											{
												value: 'value',
												label: 'label',
											},
										]}
									/>
								</CreateProjectElem>
								<CreateProjectElem>
									<div>Voir le contenu</div>
								</CreateProjectElem>
							</CreateProjectRow>
							<CreateProjectRow>
								<Button>Ajouter un client</Button>
								<Button>Ajouter une deadline</Button>
							</CreateProjectRow>
							<ModalActions>
								<Button grey>Annuler</Button>
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
