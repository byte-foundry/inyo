import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import AddItem from './add-item';
import TaskStatus from '../TaskStatus';
import CommentIcon from '../CommentIcon';
import Plural from '../Plural';
import {
	FlexRow,
	alpha10,
	primaryWhite,
	primaryBlue,
	gray80,
	Button,
} from '../../utils/content';
import {
	UPDATE_ITEM,
	REMOVE_ITEM,
	ACCEPT_ITEM,
	REJECT_ITEM,
} from '../../utils/mutations';
import {GET_PROJECT_DATA_WITH_TOKEN} from '../../utils/queries';
import {ReactComponent as TimeIcon} from '../../utils/icons/time.svg';
import {ReactComponent as DateIcon} from '../../utils/icons/date.svg';
import {ReactComponent as ContactIcon} from '../../utils/icons/contact.svg';

const ItemName = styled(FlexRow)`
	margin: 0;
	font-size: 15px;
	flex: 1;
	padding-right: 1em;
`;
const ItemMain = styled(FlexRow)`
	padding: 10px 20px;
	font-size: 13px;
	position: relative;
	cursor: ${props => (props.customer ? 'initial' : 'pointer')};
	width: 100%;
	justify-content: space-between;
`;

const ItemUnit = styled('div')`
	font-size: 15px;
	flex: 0 0 140px;
	text-align: right;
	display: flex;
	align-items: center;
	color: ${props => props.color || gray80};
`;

const ItemStatus = styled('div')`
	border: solid 2px ${primaryBlue};
	border-radius: 3px;
	color: ${primaryBlue};
	padding: 0 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 1em;
	margin-top: -1px;
`;

const ItemRow = styled(FlexRow)`
	flex: 1;
	align-items: center;
	background: ${primaryWhite};
	margin-bottom: 7px;
	box-sizing: border-box;
	border-right: 5px solid
		${props => (props.reviewer === 'USER' ? primaryWhite : primaryBlue)};
	padding: 5px 0px 5px 20px;
`;

const CommentContainer = styled('div')`
	flex: 0 0 28px;
`;

class Item extends Component {
	state = {
		shouldDisplayAddItem: false,
	};

	submitItem = (itemMutation) => {
		itemMutation({
			variables: {
				itemId: this.props.item.id,
				token: this.props.match.params.customerToken,
			},
			update: (cache, {data: {itemMutation: mutatedItem}}) => {
				toast.info(
					<div>
						<p>Tâche terminé</p>
					</div>,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 3000,
					},
				);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA_WITH_TOKEN,
					variables: {
						projectId: this.props.match.params.projectId,
						token: this.props.match.params.customerToken,
					},
				});
				const section = data.project.sections.find(
					e => e.id === this.props.sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === mutatedItem.id,
				);

				section.items[itemIndex].status = mutatedItem.status;
				try {
					cache.writeQuery({
						query: GET_PROJECT_DATA_WITH_TOKEN,
						variables: {
							projectId: this.props.match.params.projectId,
							token: this.props.match.params.customerToken,
						},
						data,
					});
				}
				catch (e) {
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	render() {
		const {
			item,
			sectionId,
			editItem,
			finishItem,
			unfinishItem,
			mode,
			projectStatus,
			customer,
			onClickCommentIcon,
			daysUntilDeadline,
		} = this.props;
		const {comments, status} = item;
		const {shouldDisplayAddItem} = this.state;
		const customerViewMode = this.props.match.params.customerToken;

		if (shouldDisplayAddItem && mode === 'edit' && editItem) {
			return (
				<Mutation mutation={UPDATE_ITEM}>
					{updateItem => (
						<Mutation mutation={REMOVE_ITEM}>
							{removeItem => (
								<AddItem
									item={item}
									remove={() => {
										this.props.removeItem(
											item.id,
											sectionId,
											removeItem,
										);
										this.setState({
											shouldDisplayAddItem: false,
										});
									}}
									cancel={() => {
										this.setState({
											shouldDisplayAddItem: false,
										});
									}}
									done={(data) => {
										editItem(
											item.id,
											sectionId,
											data,
											updateItem,
										);
										this.setState({
											shouldDisplayAddItem: false,
										});
									}}
								/>
							)}
						</Mutation>
					)}
				</Mutation>
			);
		}
		if (shouldDisplayAddItem && mode === 'see' && editItem) {
			return (
				<Mutation mutation={UPDATE_ITEM}>
					{updateItem => (
						<Mutation mutation={REMOVE_ITEM}>
							{removeItem => (
								<AddItem
									item={item}
									remove={() => {
										this.props.removeItem(
											item.id,
											sectionId,
											removeItem,
										);
										this.setState({
											shouldDisplayAddItem: false,
										});
									}}
									cancel={() => {
										this.setState({
											shouldDisplayAddItem: false,
										});
									}}
									done={(data) => {
										this.setState({
											shouldDisplayAddItem: false,
										});
										editItem(
											item.id,
											sectionId,
											data,
											updateItem,
										);
									}}
								/>
							)}
						</Mutation>
					)}
				</Mutation>
			);
		}
		return (
			<ItemRow reviewer={item.reviewer}>
				{(customerViewMode
					|| mode === 'see'
					|| mode === 'dashboard') && (
					<TaskStatus
						status={item.status}
						itemId={item.id}
						sectionId={sectionId}
						reviewer={item.reviewer}
						mode={mode}
						customerViewMode={customerViewMode}
						projectStatus={projectStatus}
						finishItem={finishItem}
						unfinishItem={unfinishItem}
					/>
				)}
				<ItemMain
					projectStatus={projectStatus}
					customer={customerViewMode}
					justifyContent="space-between"
					onClick={() => {
						if (this.props.onClick) {
							this.props.onClick();
							return;
						}
						if (!customerViewMode && item.status !== 'FINISHED') {
							this.setState({shouldDisplayAddItem: true});
						}
					}}
				>
					<ItemName>
						<span>{item.name}</span>
					</ItemName>
					{customerViewMode
						&& status === 'UPDATED_SENT' && (
						<ItemStatus>Mis à jour</ItemStatus>
					)}
					{customerViewMode
						&& status === 'ADDED_SENT' && (
						<ItemStatus>Ajouté</ItemStatus>
					)}
					<ItemUnit color={primaryBlue}>
						{/* This is a hacky way to remove only the figures after the second decimal */}
						{(+item.unit.toFixed(2)).toLocaleString()}{' '}
						<Plural
							singular="jour"
							plural="jours"
							value={item.unit}
						/>
					</ItemUnit>
					{mode === 'dashboard'
						&& typeof daysUntilDeadline === 'number' && (
						<ItemUnit color={primaryBlue}>
							{daysUntilDeadline}{' '}
							<Plural
								singular="jour"
								plural="jours"
								value={daysUntilDeadline}
							/>
						</ItemUnit>
					)}
					{mode === 'dashboard' && <ItemUnit>{customer}</ItemUnit>}
					{(customerViewMode || mode === 'see') && (
						<CommentContainer>
							<CommentIcon
								onClick={onClickCommentIcon}
								comments={comments}
								userType={
									customerViewMode ? 'Customer' : 'User'
								}
							/>
						</CommentContainer>
					)}
				</ItemMain>
			</ItemRow>
		);
	}
}

export default withRouter(Item);
