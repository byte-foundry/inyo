import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import AddItem from './add-item';
import {H4, H5, FlexRow} from '../../utils/content';
import {UPDATE_ITEM, REMOVE_ITEM} from '../../utils/mutations';

const QuoteAddItem = styled('button')``;
const ItemName = styled(H5)`
	margin: 0;
`;
const ItemMain = styled(FlexRow)`
	padding: 10px 20px;
	margin-bottom: 5px;
	border: 1px solid black;
`;

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddItem: false,
		};
	}

	render() {
		const {item, sectionId, editItem} = this.props;
		const {shouldDisplayAddItem} = this.state;

		return shouldDisplayAddItem ? (
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
		) : (
			<ItemMain
				justifyContent="space-between"
				onClick={() => {
					this.setState({shouldDisplayAddItem: true});
				}}
			>
				<ItemName>{item.name}</ItemName>
				<span>{item.unit}</span>
				<span>{item.unitPrice}€</span>
			</ItemMain>
		);
	}
}

export default Item;
