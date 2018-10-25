import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import AddItem from './add-item';
import AmendItem from './amend-item';
import TaskStatus from '../TaskStatus';
import {
	FlexRow, gray70, primaryWhite, Button,
} from '../../utils/content';
import {
	UPDATE_ITEM,
	REMOVE_ITEM,
	UPDATE_VALIDATED_ITEM,
	ACCEPT_ITEM,
	REJECT_ITEM,
} from '../../utils/mutations';
import {GET_QUOTE_DATA_WITH_TOKEN} from '../../utils/queries';

const ItemName = styled(FlexRow)`
	margin: 0;
	font-size: 13px;
	width: 50%;
`;
const ItemMain = styled(FlexRow)`
	padding: 10px 20px;
	margin-bottom: 5px;
	border: 1px solid ${gray70};
	background: ${primaryWhite};
	font-size: 13px;
	position: relative;
`;

const CommentsCount = styled('div')`
	background: #3860ff;
	color: ${primaryWhite};
	padding: 5px;
	width: 25px;
	height: 14px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	&:after {
		border-top: solid 5px #3860ff;
		border-left: solid 5px transparent;
		border-right: solid 5px transparent;
		content: ' ';
		height: 0px;
		width: 0px;
		position: absolute;
		bottom: -5px;
		display: block;
	}
`;

const ItemStatus = styled('div')`
	border: solid 1px purple;
	border-radius: 3px;
	color: purple;
	padding: 0 10px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ItemCustomerActions = styled('div')`
	position: absolute;
	right: -200px;
	top: -2px;
`;

const ItemCustomerButton = styled(Button)`
	margin-right: 5px;
	background: ${props => (props.accept ? '#00a676' : '#fe4a49')};
	font-size: 14px;
	color: ${primaryWhite};
	border-color: ${props => (props.accept ? '#00a676' : '#fe4a49')};

	${`&:hover {
		border-color: ${props => (props.accept ? '#00a676' : '#fe4a49')};
		color: ${props => (props.accept ? '#00a676' : '#fe4a49')};
	}`};
`;

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddItem: false,
		};
	}

	seeComments = () => {
		const {quoteId, customerToken} = this.props.match.params;
		const {
			item: {id},
		} = this.props;

		this.props.history.push(
			`/app/quotes/${this.props.match.params.quoteId}/view/${
				this.props.match.params.customerToken
			}/comments/${id}`,
		);
	};

	submitItem = (itemMutation) => {
		itemMutation({
			variables: {
				itemId: this.props.item.id,
				token: this.props.match.params.customerToken,
			},
			update: (cache, {data: {itemMutation}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA_WITH_TOKEN,
					variables: {
						quoteId: this.props.match.params.quoteId,
						token: this.props.match.params.customerToken,
					},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === this.props.sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === itemMutation.id,
				);

				section.items[itemIndex].status = itemMutation.status;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA_WITH_TOKEN,
						variables: {
							quoteId: this.props.match.params.quoteId,
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
			item, sectionId, editItem, mode,
		} = this.props;
		const {comments, status} = item;
		const {shouldDisplayAddItem} = this.state;
		const customerViewMode = this.props.match.params.customerToken;

		if (shouldDisplayAddItem && mode === 'edit') {
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
		if (shouldDisplayAddItem && mode === 'see') {
			return (
				<Mutation mutation={UPDATE_VALIDATED_ITEM}>
					{updateValidatedItem => (
						<AmendItem
							item={item}
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
									updateValidatedItem,
								);
							}}
						/>
					)}
				</Mutation>
			);
		}
		return (
			<ItemMain justifyContent="space-between">
				<ItemName>
					{mode === 'see' && (
						<TaskStatus
							status={item.status}
							itemId={item.id}
							sectionId={sectionId}
							mode={mode}
						/>
					)}
					<span
						onClick={() => {
							if (!customerViewMode) {
								this.setState({shouldDisplayAddItem: true});
							}
						}}
						style={{cursor: 'pointer'}}
					>
						{item.name}
					</span>
				</ItemName>
				{customerViewMode
					&& status === 'UPDATED_SENT' && (
					<ItemStatus>UPDATED</ItemStatus>
				)}
				{customerViewMode
					&& status === 'UPDATED_SENT'
					&& comments.length > 0 && (
					<CommentsCount onClick={this.seeComments}>
						{comments.length}
					</CommentsCount>
				)}
				<span>{item.unit} jours</span>
				<span>{item.unitPrice}€</span>
				<span>{item.unitPrice * item.unit}€</span>
				{customerViewMode
					&& item.status === 'UPDATED_SENT' && (
					<ItemCustomerActions>
						<Mutation mutation={ACCEPT_ITEM}>
							{acceptItem => (
								<ItemCustomerButton
									accept
									onClick={() => this.submitItem(acceptItem)
									}
								>
										Accepter
								</ItemCustomerButton>
							)}
						</Mutation>
						<Mutation mutation={REJECT_ITEM}>
							{rejectItem => (
								<ItemCustomerButton
									onClick={() => this.submitItem(rejectItem)
									}
								>
										Rejeter
								</ItemCustomerButton>
							)}
						</Mutation>
					</ItemCustomerActions>
				)}
			</ItemMain>
		);
	}
}

export default withRouter(Item);
