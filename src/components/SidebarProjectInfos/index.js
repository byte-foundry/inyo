import React, {useState, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import {useQuery, useMutation} from 'react-apollo-hooks';
import moment from 'moment';
import useOnClickOutside from 'use-onclickoutside';

import {
	SubHeading,
	Button,
	primaryPurple,
	primaryGrey,
	P,
} from '../../utils/new/design-system';
import ConfirmModal from '../ConfirmModal';
import CustomerNameAndAddress from '../CustomerNameAndAddress';
import {ModalContainer} from '../../utils/content';
import StaticCustomerView from '../StaticCustomerView';
import DuplicateProjectButton from '../DuplicateProjectButton';
import DateInput from '../DateInput';
import Plural from '../Plural';
import CustomerModal from '../CustomerModal';

import {ReactComponent as EyeIcon} from '../../utils/icons/eye.svg';
import {ReactComponent as Pencil} from '../../utils/icons/pencil.svg';

import {GET_PROJECT_INFOS} from '../../utils/queries';
import {UPDATE_PROJECT, REMOVE_PROJECT} from '../../utils/mutations';

const Aside = styled('aside')`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 270px;
	padding-left: 30px;
`;

const SubSection = styled('div')`
	margin: 3rem 0;

	:first-child {
		margin-top: 0;
	}
`;

const ClientPreviewIcon = styled(EyeIcon)`
	vertical-align: middle;
	margin-top: -2px;
	width: 16px;
	margin-right: 10px;
	margin-left: 4px;
`;

const PreviewModal = styled(ModalContainer)`
	min-height: 600px;
	padding: 0;
`;

const Notice = styled(P)`
	color: #fff;
	background: ${primaryPurple};
	padding: 10px;
	text-align: center;
	margin: 0;
`;

const CheckBoxLabel = styled('label')`
	font-size: 13px;
	margin: 0.5em 0;
	color: ${primaryPurple};
	cursor: pointer;

	input[type='checkbox'] {
		margin-left: 0.4em;
		margin-right: 0.8em;
		margin-top: -1px;
	}
`;

const BigNumber = styled(P)`
	font-size: 20px;
	font-weight: 600;
	color: ${primaryGrey};
`;

const DateContainer = styled('div')`
	position: relative;
`;

const ClientTitle = styled(SubHeading)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const PencilElem = styled(Pencil)`
	cursor: pointer;
	width: 15px;
	margin-top: -2px;
`;

const SidebarProjectInfos = ({
	projectId,
	hasClientAttributedTasks,
	history,
}) => {
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [editDueDate, setEditDueDate] = useState(false);
	const [isCustomerPreviewOpen, setCustomerPreview] = useState(false);
	const [askNotifyActivityConfirm, setAskNotifyActivityConfirm] = useState(
		null,
	);
	const updateProject = useMutation(UPDATE_PROJECT);
	const removeProject = useMutation(REMOVE_PROJECT);
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId},
	});

	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setEditDueDate(false);
	});

	if (error) throw error;

	const {project} = data;

	return (
		<Aside>
			{/* <SubSection>
				<SubHeading>Menu projet</SubHeading>
			</SubSection> */}

			<SubSection>
				<ClientTitle>
					Votre client
					<PencilElem onClick={() => setEditCustomer(true)} />
				</ClientTitle>
				{project.customer ? (
					<>
						<CustomerNameAndAddress customer={project.customer} />
						<CheckBoxLabel>
							<input
								type="checkbox"
								checked={project.notifyActivityToCustomer}
								onChange={async () => {
									if (project.notifyActivityToCustomer) {
										const confirmed = await new Promise(
											resolve => setAskNotifyActivityConfirm(
												resolve,
											),
										);

										setAskNotifyActivityConfirm(null);

										if (!confirmed) {
											return;
										}
									}

									await updateProject({
										variables: {
											projectId: project.id,
											notifyActivityToCustomer: !project.notifyActivityToCustomer,
										},
									});
								}}
							/>
							Notifier mon client par email
						</CheckBoxLabel>
						{askNotifyActivityConfirm && (
							<ConfirmModal
								onConfirm={confirmed => askNotifyActivityConfirm(confirmed)
								}
								closeModal={() => askNotifyActivityConfirm(false)
								}
							>
								<P>
									En décochant cette option, votre client ne
									recevra aucune notification de l'avancée de
									votre projet.
								</P>
								{hasClientAttributedTasks && (
									<P>
										Cependant, certaines des tâches sont
										attribuées à votre client et nécessitent
										l'envoi d'emails à celui-ci. Désactiver
										les notifications changera aussi
										l'attribution de ces tâches et votre
										client n'en sera pas averti.
									</P>
								)}
								<P>Êtes-vous sûr de vouloir continuer?</P>
							</ConfirmModal>
						)}
						<Button link onClick={() => setCustomerPreview(true)}>
							<ClientPreviewIcon />
							<span>Voir la vue de mon client</span>
						</Button>
					</>
				) : (
					<Button grey icon="+" onClick={() => setEditCustomer(true)}>
						Ajouter un client
					</Button>
				)}

				{isEditingCustomer && (
					<CustomerModal
						onValidate={(selected) => {
							if (
								project.customer
								&& selected.customerId
								&& project.customer.id !== selected.customerId
							) {
								return project;
							}

							return updateProject({
								variables: {
									projectId: project.id,
									...selected,
								},
							});
						}}
						selectedCustomerId={
							project.customer && project.customer.id
						}
						onDismiss={() => setEditCustomer(false)}
					/>
				)}
			</SubSection>

			{isCustomerPreviewOpen && (
				<PreviewModal
					size="large"
					onDismiss={() => setCustomerPreview(false)}
				>
					<Notice>
						Cette vue est celle que verra votre client lorsqu'il
						devra effectuer des actions.
					</Notice>
					<StaticCustomerView projectId={project.id} />
				</PreviewModal>
			)}

			{project.deadline !== null && (
				<SubSection>
					<SubHeading>Deadline</SubHeading>
					{project.deadline || editDueDate ? (
						<DateContainer onClick={() => setEditDueDate(true)}>
							<BigNumber>
								{(project.deadline
									&& moment(project.deadline).format(
										'DD/MM/YYYY',
									)) || <>&mdash;</>}
							</BigNumber>
							{editDueDate && (
								<DateInput
									innerRef={dateRef}
									date={moment(
										project.deadline || new Date(),
									)}
									onDateChange={(date) => {
										updateProject({
											variables: {
												projectId: project.id,
												deadline: date.toISOString(),
											},
											optimisticResponse: {
												__typename: 'Mutation',
												updateProject: {
													__typename: 'Project',
													...project,
													dueDate: date.toISOString(),
												},
											},
										});
										setEditDueDate(false);
									}}
									duration={project.total}
									position="left"
								/>
							)}
						</DateContainer>
					) : (
						<Button
							grey
							icon="+"
							onClick={() => setEditDueDate(true)}
						>
							Ajouter une deadline
						</Button>
					)}
				</SubSection>
			)}

			{project.daysUntilDeadline !== null && (
				<SubSection>
					<SubHeading>Marge jours restants</SubHeading>
					<BigNumber>
						{project.daysUntilDeadline}&nbsp;
						<Plural
							value={project.daysUntilDeadline}
							singular="jour"
							plural="jours"
						/>
					</BigNumber>
				</SubSection>
			)}

			<DuplicateProjectButton
				grey
				projectId={project.id}
				onCreate={({id}) => history.push(`/app/tasks?projectId=${id}`)}
			>
				Dupliquer le projet
			</DuplicateProjectButton>

			{/* <Button red onClick={removeProject}>
				Supprimer le projet
			</Button> */}
		</Aside>
	);
};

export default withRouter(SidebarProjectInfos);
