import React, {Component} from 'react';
import styled from 'react-emotion';
import AddItem from './add-item';
import {H4, H5, FlexRow} from '../../utils/content';

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
		const {
			item,
			sectionIndex,
			itemIndex,
			editItem,
			removeItem,
		} = this.props;
		const {shouldDisplayAddItem} = this.state;

		return shouldDisplayAddItem ? (
			<AddItem
				item={item}
				remove={() => {
					removeItem(sectionIndex, itemIndex);
					this.setState({shouldDisplayAddItem: false});
				}}
				cancel={() => {
					this.setState({shouldDisplayAddItem: false});
				}}
				done={(data) => {
					editItem(sectionIndex, itemIndex, data);
					this.setState({shouldDisplayAddItem: false});
				}}
			/>
		) : (
			<ItemMain
				justifyContent="space-between"
				onClick={() => {
					this.setState({shouldDisplayAddItem: true});
				}}
			>
				<ItemName>{item.name}</ItemName>
				<span>{item.amount}</span>
				<span>{item.price}€</span>
			</ItemMain>
		);
	}
}

export default Item;
