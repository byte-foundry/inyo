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
import {
	GET_PROJECT_DATA,
	GET_PROJECT_DATA_WITH_TOKEN,
} from '../../utils/queries';
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
	margin-bottom: 1rem;
`;

const DocType = styled('div')`
	background: ${props => (props.active ? primaryPurple : 'transparent')};
	color: ${props => (props.active ? primaryWhite : primaryPurple)};
	margin-right: 1rem;
	padding: 0.3rem 0.5rem;
	border-radius: 5px;
	border: solid 1px ${primaryPurple};
	cursor: pointer;

	&:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
	}
`;

const UploadContainer = styled('div')`
	margin-top: 1rem;
`;

const headerCells = [
	{
		get label() {
			return fbt('Type', 'header document type');
		},
		prop: 'extension',
	},
	{
		get label() {
			return fbt('Fichier', 'header document filename');
		},
		prop: 'filename',
	},
	{
		get label() {
			return fbt('Section', 'header document section');
		},
		prop: 'sectionName',
	},
	{
		get label() {
			return fbt('Tâche', 'header document tâche');
		},
		prop: 'itemName',
	},
	{
		get label() {
			return fbt('Date', 'header document date');
		},
		prop: 'datetime',
	},
	{
		get label() {
			return fbt('Uploadeur', 'header document uploadeur');
		},
		prop: 'ownerName',
	},
];

const ProjectDocumentsFolders = ({projectId, customerToken}) => {
	const [active, setActive] = useState(documentTypes[0].type);
	const [uploadAttachments] = useMutation(UPLOAD_ATTACHMENTS);
	const [removeFile] = useMutation(REMOVE_ATTACHMENTS);
	const {data: projectData, error} = useQuery(
		customerToken ? GET_PROJECT_DATA_WITH_TOKEN : GET_PROJECT_DATA,
		{
			variables: {projectId, token: customerToken},
			suspend: true,
		},
	);
	const [sorting, setSorting] = useState('datetime');
	const [order, setOrder] = useState(1);

	const sortAndSwitch = (prop) => {
		if (sorting === prop) {
			setOrder(-order);
		}
		else {
			setSorting(prop);
			setOrder(1);
		}
	};

	const uploadAttachmentsCb = useCallback(
		newFiles => uploadAttachments({
			variables: {
				projectId,
				files: newFiles,
				documentType: active,
				token: customerToken,
			},
			context: {hasUpload: true},
		}),
		[projectId, active],
	);

	if (error) throw error;

	const files = [
		...projectData.project.attachments,
		...projectData.project.sections.flatMap(section => section.items.flatMap(item => item.attachments.map(attachment => ({
			...attachment,
			itemName: item.name,
			sectionName: section.name,
		})))),
	]
		.filter(attachment => (attachment.documentType || 'DEFAULT') === active)
		.map((file) => {
			const filenameSplit = file.filename.split('.');
			const extension = filenameSplit[filenameSplit.length - 1];
			const momentDate = moment(file.createdAt);

			return {
				...file,
				extension,
				ownerName: formatName(
					file.owner.firstName,
					file.owner.lastName,
				),
				datetime: momentDate.valueOf(),
				formattedDate: momentDate.format('L'),
				longFormattedDate: momentDate.format('LLL'),
			};
		})
		.sort((a, b) => (a[sorting] > b[sorting] ? order : -order));

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
						{headerCells.map(cell => (
							<HeaderCell
								onClick={() => sortAndSwitch(cell.prop)}
							>
								{cell.label}
								{cell.prop === sorting && (
									<MaterialIcon
										style={{
											height: '100%',
											paddingTop: '3px',
											float: 'right',
										}}
										size="tiny"
										icon={
											order === 1
												? 'arrow_drop_down'
												: 'arrow_drop_up'
										}
									/>
								)}
							</HeaderCell>
						))}
					</RowHeader>
				</thead>
				{files.map(file => (
					<Row>
						<Cell>
							<FileIcon
								size="32"
								extension={file.extension}
								{...(defaultStyles[file.extension] || {})}
							/>
						</Cell>
						<Cell style={{maxWidth: '350px'}}>
							<a href={file.url} style={{margin: '0 0.5rem'}}>
								{file.filename}
							</a>
						</Cell>
						<Cell>{file.sectionName}</Cell>
						<Cell>{file.itemName}</Cell>
						<Cell title={file.longFormattedDate}>
							{file.formattedDate}
						</Cell>
						<Cell>{file.ownerName}</Cell>
						{!customerToken && (
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
						)}
					</Row>
				))}
			</Table>
			<UploadContainer>
				<UploadDashboardButton onUploadFiles={uploadAttachmentsCb}>
					<fbt project="inyo" desc="notification message">
						Ajouter un document
					</fbt>
				</UploadDashboardButton>
			</UploadContainer>
		</DocumentFolders>
	);
};

export default ProjectDocumentsFolders;
