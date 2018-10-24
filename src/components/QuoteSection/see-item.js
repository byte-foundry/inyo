import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import AddItem from './add-item';
import AmendItem from './amend-item';
import TaskStatus from '../TaskStatus';
import {
	H4, H5, FlexRow, gray70, primaryWhite,
} from '../../utils/content';
import {
	UPDATE_ITEM,
	REMOVE_ITEM,
	UPDATE_VALIDATED_ITEM,
} from '../../utils/mutations';

const QuoteAddItem = styled('button')``;
const ItemName = styled(H5)`
	margin: 0;
	font-size: 13px;
	width: 40%;
`;
const ItemMain = styled(FlexRow)`
	padding: 10px 20px;
	margin-bottom: 5px;
	border: 1px solid ${gray70};
	background: ${primaryWhite};
	font-size: 13px;
`;

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddItem: false,
		};
	}

	render() {
		const {
			item, sectionId, editItem, mode,
		} = this.props;
		const {shouldDisplayAddItem} = this.state;

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
								editItem(
									item.id,
									sectionId,
									data,
									updateValidatedItem,
								);
								this.setState({
									shouldDisplayAddItem: false,
								});
							}}
						/>
					)}
				</Mutation>
			);
		}
		return (
			<ItemMain justifyContent="space-between">
				{mode === 'see' && (
					<TaskStatus
						status={item.status}
						itemId={item.id}
						sectionId={sectionId}
						mode={mode}
					/>
				)}
				<ItemName
					onClick={() => {
						this.setState({shouldDisplayAddItem: true});
					}}
				>
					{item.name}
				</ItemName>
				<span>{item.unit} jours</span>
				<span>{item.unitPrice}€</span>
				<span>{item.unitPrice * item.unit}€</span>
			</ItemMain>
		);
	}
}

export default Item;
