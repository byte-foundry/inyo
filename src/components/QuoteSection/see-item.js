import React, { Component } from "react";
import styled from "react-emotion";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AddItem from "./add-item";
import AmendItem from "./amend-item";
import TaskStatus from "../TaskStatus";
import CommentIcon from "../CommentIcon";
import CommentModal from "../CommentModal";
import { FlexRow, alpha10, primaryWhite, Button } from "../../utils/content";
import {
	UPDATE_ITEM,
	REMOVE_ITEM,
	UPDATE_VALIDATED_ITEM,
	ACCEPT_ITEM,
	REJECT_ITEM
} from "../../utils/mutations";
import { GET_QUOTE_DATA_WITH_TOKEN } from "../../utils/queries";

const ItemName = styled(FlexRow)`
	margin: 0;
	font-size: 13px;
	width: 50%;
`;
const ItemMain = styled(FlexRow)`
	padding: 10px 20px;
	font-size: 13px;
	position: relative;
	cursor: ${props => (props.customer ? "initial" : "pointer")};
	width: 100%;
`;

const ItemStatus = styled("div")`
	border: solid 1px purple;
	border-radius: 3px;
	color: purple;
	padding: 0 10px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ItemCustomerActions = styled("div")`
	position: absolute;
	right: -222px;
	top: -2px;
`;

const ItemCustomerButton = styled(Button)`
	margin-right: 5px;
	background: ${props => (props.accept ? "#00a676" : "#fe4a49")};
	font-size: 14px;
	color: ${primaryWhite};
	border-color: ${props => (props.accept ? "#00a676" : "#fe4a49")};

	${`&:hover {
		border-color: ${props => (props.accept ? "#00a676" : "#fe4a49")};
		color: ${props => (props.accept ? "#00a676" : "#fe4a49")};
	}`};
`;

const ItemRow = styled(FlexRow)`
	align-items: center;
	box-shadow: 0px 0px 8px ${alpha10};
	margin-bottom: 7px;
	background: ${primaryWhite};
	padding: 5px 20px;
`;

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddItem: false,
			shouldDisplayCommentModal: false
		};
	}

	seeCommentModal = (e) => {
		e.stopPropagation();
		this.setState({ shouldDisplayCommentModal: true });
	};

	closeCommentModal = () => {
		this.setState({ shouldDisplayCommentModal: false });
		this.props.refetch();
	};

	submitItem = itemMutation => {
		itemMutation({
			variables: {
				itemId: this.props.item.id,
				token: this.props.match.params.customerToken
			},
			update: (cache, { data: { itemMutation } }) => {
				toast.info(
					<div>
						<p>📬 Le prestataire a été notifié.</p>
					</div>,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 3000
					}
				);
				const data = cache.readQuery({
					query: GET_QUOTE_DATA_WITH_TOKEN,
					variables: {
						quoteId: this.props.match.params.quoteId,
						token: this.props.match.params.customerToken
					}
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === this.props.sectionId
				);
				const itemIndex = section.items.find(
					e => e.id === itemMutation.id
				);

				section.items[itemIndex].status = itemMutation.status;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA_WITH_TOKEN,
						variables: {
							quoteId: this.props.match.params.quoteId,
							token: this.props.match.params.customerToken
						},
						data
					});
				} catch (e) {
					throw new Error(e);
				}
				this.setState({ apolloTriggerRenderTemporaryFix: true });
			}
		});
	};

	render() {
		const { item, sectionId, editItem, mode } = this.props;
		const { comments, status } = item;
		const { shouldDisplayAddItem } = this.state;
		const customerViewMode = this.props.match.params.customerToken;

		const isValidStatus =
			status && (status === "ADDED_SENT" || status === "UPDATED_SENT");

		if (shouldDisplayAddItem && mode === "edit") {
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
											removeItem
										);
										this.setState({
											shouldDisplayAddItem: false
										});
									}}
									cancel={() => {
										this.setState({
											shouldDisplayAddItem: false
										});
									}}
									done={data => {
										editItem(
											item.id,
											sectionId,
											data,
											updateItem
										);
										this.setState({
											shouldDisplayAddItem: false
										});
									}}
								/>
							)}
						</Mutation>
					)}
				</Mutation>
			);
		}
		if (shouldDisplayAddItem && mode === "see") {
			return (
				<Mutation mutation={UPDATE_VALIDATED_ITEM}>
					{updateValidatedItem => (
						<AmendItem
							item={item}
							cancel={() => {
								this.setState({
									shouldDisplayAddItem: false
								});
							}}
							done={data => {
								this.setState({
									shouldDisplayAddItem: false
								});
								editItem(
									item.id,
									sectionId,
									data,
									updateValidatedItem
								);
							}}
						/>
					)}
				</Mutation>
			);
		}
		return (
			<ItemRow>
				{(customerViewMode || mode === "see") && (
					<TaskStatus
						status={item.status}
						itemId={item.id}
						sectionId={sectionId}
						mode={mode}
						customerViewMode={customerViewMode}
					/>
				)}
				<ItemMain
					customer={customerViewMode}
					justifyContent="space-between"
					onClick={() => {
						if (!customerViewMode) {
							this.setState({ shouldDisplayAddItem: true });
						}
					}}
				>
					<ItemName>
						<span>{item.name}</span>
					</ItemName>
					{customerViewMode &&
						status === "UPDATED_SENT" && (
							<ItemStatus>Mis à jour</ItemStatus>
						)}
					{(customerViewMode || mode === "see") && (
						<CommentIcon
							onClick={this.seeCommentModal}
							comments={comments}
							userType={customerViewMode ? "Customer" : "User"}
						/>
					)}
					{customerViewMode &&
						status === "ADDED_SENT" && (
							<ItemStatus>Ajouté</ItemStatus>
						)}
					<span>{item.pendingUnit || item.unit} jours</span>
					<span>{item.unitPrice.toLocaleString("fr-FR")}€</span>
					<span>
						{item.unitPrice * (item.pendingUnit || item.unit)}€
					</span>
					{customerViewMode &&
						isValidStatus && (
							<ItemCustomerActions>
								<ToastContainer />
								<Mutation mutation={ACCEPT_ITEM}>
									{acceptItem => (
										<ItemCustomerButton
											accept
											onClick={() =>
												this.submitItem(acceptItem)
											}
										>
											Accepter
										</ItemCustomerButton>
									)}
								</Mutation>
								<Mutation mutation={REJECT_ITEM}>
									{rejectItem => (
										<ItemCustomerButton
											onClick={() =>
												this.submitItem(rejectItem)
											}
										>
											Rejeter
										</ItemCustomerButton>
									)}
								</Mutation>
							</ItemCustomerActions>
						)}
				</ItemMain>
				{this.state.shouldDisplayCommentModal && (
					<CommentModal
						closeCommentModal={this.closeCommentModal}
						itemId={item.id}
						customerToken={customerViewMode}
						taskName={item.name}
					/>
				)}
			</ItemRow>
		);
	}
}

export default withRouter(Item);
