import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useCallback, useState} from 'react';
import FileIcon, {defaultStyles} from 'react-file-icon';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {documentTypes} from '../../utils/constants';
import {formatName} from '../../utils/functions';
import {ReactComponent as SectionIcon} from '../../utils/icons/section-icon.svg';
import {REMOVE_ATTACHMENTS, UPLOAD_ATTACHMENTS} from '../../utils/mutations';
import {
	ActionCell,
	Actions,
	Cell,
	HeaderCell,
	primaryPurple,
	primaryWhite,
	Row,
	RowHeader,
	Table,
	TaskIcon,
} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import UploadDashboardButton from '../UploadDashboardButton';

const DocumentFolders = styled('div')`
	flex: 1;
`;

const SectionHeaderDocument = styled('div')`
	display: flex;
	align-items: center;
	cursor: pointer;
`;

const SectionContentDocument = styled('div')`
	margin-left: 1.5rem;
	margin-bottom: 1rem;
	height: ${props => (props.open ? 'auto' : '0px')};
	overflow: hidden;
`;

const TaskHeaderDocument = styled('div')`
	display: flex;
	align-items: center;
	cursor: pointer;
`;

const TaskContentDocument = styled('div')`
	margin-left: 4.4rem;
	height: ${props => (props.open ? 'auto' : '0px')};
	overflow: hidden;
`;

const DocTypeList = styled('div')`
	display: flex;
`;

const DocType = styled('div')`
	background: ${props => (props.active ? primaryPurple : 'transparent')};
	color: ${props => (props.active ? primaryWhite : primaryPurple)};
`;

const TaskDocumentFolders = ({task}) => {
	const [uploadAttachments] = useMutation(UPLOAD_ATTACHMENTS);
	const [removeFile] = useMutation(REMOVE_ATTACHMENTS);
	const [open, setOpen] = useState(false);

	return (
		<div>
			<TaskHeaderDocument onClick={() => setOpen(!open)}>
				<MaterialIcon
					size="medium"
					icon={open ? 'arrow_drop_down' : 'arrow_right'}
				/>
				<TaskIcon
					status={task.status}
					noData={true}
					noAnim={true}
					type={task.type}
					style={{marginRight: '-0.5rem'}}
					onClick={() => {}}
				/>
				{task.name} (
				<fbt desc="files">
					<fbt:plural
						count={task.attachments.length}
						name="files"
						showCount="yes"
						many="fichiers"
					>
						fichier
					</fbt:plural>
				</fbt>
				)
			</TaskHeaderDocument>
			<TaskContentDocument open={open}>
				{task.attachments.length > 0 ? (
					task.attachments.map(attachment => (
						<a href={attachment.url}>{attachment.filename}</a>
					))
				) : (
					<div style={{fontStyle: 'italic'}}>
						<fbt desc="no files">
							Il n'y a pas de fichier dans cette tâche
						</fbt>
					</div>
				)}
				<UploadDashboardButton
					onUploadFiles={newFiles => uploadAttachments({
						variables: {
							taskId: task.id,
							files: newFiles,
						},
						context: {hasUpload: true},
					})
					}
				>
					<fbt project="inyo" desc="notification message">
						Joindre un document à cette tâche
					</fbt>
				</UploadDashboardButton>
			</TaskContentDocument>
		</div>
	);
};

const SectionDocumentFolders = ({section}) => {
	const [open, setOpen] = useState(false);

	const attachmentsNumber = section.items.reduce(
		(acc, item) => acc + item.attachments.length,
		0,
	);

	return (
		<div>
			<SectionHeaderDocument onClick={() => setOpen(!open)}>
				<MaterialIcon
					size="medium"
					icon={open ? 'arrow_drop_down' : 'arrow_right'}
				/>
				<span style={{marginRight: '0.5rem'}}>
					<SectionIcon />
				</span>
				{section.name} (
				<fbt desc="files">
					<fbt:plural
						count={attachmentsNumber}
						name="files"
						showCount="yes"
						many="fichiers"
					>
						fichier
					</fbt:plural>
				</fbt>
				)
			</SectionHeaderDocument>
			<SectionContentDocument open={open}>
				{section.items.map(item => (
					<TaskDocumentFolders task={item} />
				))}
			</SectionContentDocument>
		</div>
	);
};

const ProjectDocumentsFolders = ({projectId}) => {
	const [active, setActive] = useState(documentTypes[0].type);
	const [uploadAttachments] = useMutation(UPLOAD_ATTACHMENTS);
	const [removeFile] = useMutation(REMOVE_ATTACHMENTS);
	const {data: projectData, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});

	const uploadAttachmentsCb = useCallback(
		newFiles => uploadAttachments({
			variables: {
				projectId,
				files: newFiles,
				documentType: active,
			},
			context: {hasUpload: true},
		}),
		[projectId, active],
	);

	const files = [
		...projectData.project.attachments,
		...projectData.project.sections.flatMap(section => section.items.flatMap(item => item.attachments.map(attachment => ({
			...attachment,
			itemName: item.name,
			sectionName: section.name,
		})))),
	].filter(attachment => (attachment.documentType || 'DEFAULT') === active);

	return (
		<DocumentFolders>
			<DocTypeList>
				{documentTypes.map(docType => (
					<DocType
						active={docType.type === active}
						onClick={() => setActive(docType.type)}
					>
						{docType.name}
					</DocType>
				))}
			</DocTypeList>
			<Table>
				<thead>
					<RowHeader>
						<HeaderCell>
							<fbt project="inyo" desc="company name">
								Type
							</fbt>
						</HeaderCell>
						<HeaderCell>
							<fbt project="inyo" desc="contact name">
								Fichier
							</fbt>
						</HeaderCell>
						<HeaderCell>
							<fbt project="inyo" desc="phone number">
								Section
							</fbt>
						</HeaderCell>
						<HeaderCell>
							<fbt project="inyo" desc="phone number">
								Tâche
							</fbt>
						</HeaderCell>
						<HeaderCell>
							<fbt project="inyo" desc="phone number">
								Date
							</fbt>
						</HeaderCell>
						<HeaderCell>
							<fbt project="inyo" desc="phone number">
								Uploadeur
							</fbt>
						</HeaderCell>
					</RowHeader>
				</thead>
				{files.map((file) => {
					const filenameSplit = file.filename.split('.');
					const extension = filenameSplit[filenameSplit.length - 1];

					return (
						<Row>
							<Cell>
								<FileIcon
									size="32"
									extension={extension}
									{...(defaultStyles[extension] || {})}
								/>
							</Cell>
							<Cell style={{maxWidth: '350px'}}>
								<a href={file.url} style={{margin: '0 0.5rem'}}>
									{file.filename}
								</a>
							</Cell>
							<Cell>{file.sectionName}</Cell>
							<Cell>{file.itemName}</Cell>
							<Cell title={moment(file.createdAt).format('LLL')}>
								{moment(file.createdAt).format('L')}
							</Cell>
							<Cell>
								{formatName(
									file.owner.firstName,
									file.owner.lastName,
								)}
							</Cell>
							<ActionCell>
								<IconButton
									icon="delete_forever"
									size="tiny"
									danger
									onClick={async () => {
										await removeFile({
											variables: {
												attachmentId: file.id,
											},
										});
									}}
								/>
							</ActionCell>
						</Row>
					);
				})}
			</Table>
			<UploadDashboardButton onUploadFiles={uploadAttachmentsCb}>
				<fbt project="inyo" desc="notification message">
					Joindre un document à cette tâche
				</fbt>
			</UploadDashboardButton>
			{/* projectData.project.sections.map(section => (
				<SectionDocumentFolders section={section} />
			)) */}
		</DocumentFolders>
	);
};

export default ProjectDocumentsFolders;
