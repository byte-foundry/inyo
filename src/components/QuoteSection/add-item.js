import React, {Component} from 'react';
import styled from 'react-emotion';
import Autocomplete from 'react-autocomplete';
import {Query} from 'react-apollo';
import {
	H4, H5, FlexRow, Input, Button,
} from '../../utils/content';
import {templates} from '../../utils/quote-templates';

import {GET_ITEMS} from '../../utils/queries';

const AddItemMain = styled('div')`
	background: #ddd;
	padding: 10px 20px;
`;

const ItemComment = styled('textarea')`
	width: 100%;
`;

const ActionButton = styled(Button)``;

class AddItem extends Component {
	constructor(props) {
		super(props);
		this.state = props.item;
	}

	render() {
		const {
			name, unit, unitPrice, description,
		} = this.state;
		const {
			item, cancel, done, remove,
		} = this.props;

		return (
			<AddItemMain>
				<FlexRow justifyContent="space-between">
					<Query query={GET_ITEMS}>
						{({loading, error, data}) => {
							if (loading) return <p>Loading...</p>;
							if (!loading && data && data.template) {
								const {items} = data.template;

								return (
									<Autocomplete
										getItemValue={item => item}
										items={items}
										shouldItemRender={(item, value) => item.includes(value)
										}
										renderItem={(item, isHighlighted) => (
											<div
												style={{
													background: isHighlighted
														? 'lightgray'
														: 'white',
												}}
											>
												{item}
											</div>
										)}
										value={name}
										onChange={(e) => {
											this.setState({
												name: e.target.value,
											});
										}}
										onSelect={(value) => {
											this.setState({
												name: value,
											});
										}}
									/>
								);
							}
						}}
					</Query>
					<Input
						type="number"
						placeholder="1"
						value={unit}
						onChange={e => this.setState({unit: parseInt(e.target.value)})
						}
					/>
					<Input
						type="number"
						placeholder="500"
						value={unitPrice}
						onChange={e => this.setState({unitPrice: parseInt(e.target.value)})
						}
					/>
				</FlexRow>
				<FlexRow>
					<ItemComment
						placeholder="Add comments or description"
						value={description}
						onChange={e => this.setState({description: e.target.value})
						}
					/>
				</FlexRow>
				<FlexRow>
					<ActionButton
						onClick={() => {
							remove();
						}}
					>
						Remove item
					</ActionButton>
					<ActionButton
						onClick={() => {
							cancel();
						}}
					>
						Cancel
					</ActionButton>
					<ActionButton
						onClick={() => {
							done(this.state);
						}}
					>
						Done
					</ActionButton>
				</FlexRow>
			</AddItemMain>
		);
	}
}

export default AddItem;
