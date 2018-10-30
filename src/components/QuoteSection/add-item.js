import React, {Component} from 'react';
import styled from 'react-emotion';
import Autocomplete from 'react-autocomplete';
import {Query} from 'react-apollo';
import link from 'medium-draft/lib/components/entities/link';
import {
	H4,
	H5,
	FlexRow,
	Input,
	Button,
	primaryBlue,
	secondaryLightBlue,
	signalGreen,
	signalOrange,
	signalRed,
	primaryWhite,
	gray30,
	gray20,
} from '../../utils/content';
import {templates} from '../../utils/quote-templates';

import {GET_ITEMS} from '../../utils/queries';

const AddItemMain = styled('div')`
	background: ${gray20};
	border: 1px solid ${primaryBlue};
	padding: 20px 20px 10px 20px;
	margin-bottom: 10px;
	border-radius: 4px;
`;

const ItemComment = styled('textarea')`
	margin-top: 10px;
	width: 100%;
	background: ${primaryWhite};
	padding: 15px 10px;
	font-family: 'Ligne';
	color: ${gray30};
`;

const ActionButton = styled(Button)`
	font-size: 13px;
	color: ${props => props.color};
	margin: 15px 0 10px;
	padding: 0 10px;
`;

const AddInput = styled(Input)`
	padding: 15px 10px;
	background: ${primaryWhite};
	width: 100px;
	margin-left: 10px;
	border-color: transparent;
	font-size: 13px;
`;

const Loading = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

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
							if (loading) {
								return <Loading>Chargement...</Loading>;
							}
							if (!loading && data && data.template) {
								const {items} = data.template;

								console.log(data);

								return (
									<Autocomplete
										getItemValue={item => item}
										items={items}
										shouldItemRender={(item, value) => item.includes(value)
										}
										renderItem={(item, isHighlighted) => (
											<div
												background={
													isHighlighted
														? 'lightgray'
														: 'white'
												}
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
										wrapperStyle={{
											flex: '2',
											marginRight: '20px',
										}}
										menuStyle={{
											borderRadius: '0px',
											boxShadow:
												'0 2px 12px rgba(0, 0, 0, 0.1)',
											background: 'rgb(255, 255, 255)',
											padding: '2px 0',
											fontSize: '11px',
											position: 'fixed',
											overflow: 'auto',
											maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
										}}
										inputProps={{
											style: {
												color: gray30,
												background: primaryWhite,
												borderColor: 'transparent',
												fontSize: '13px',
												fontFamily: 'Ligne',
												width: '100%',
												padding: '16px 10px',
											},
										}}
									/>
								);
							}
						}}
					</Query>
					<FlexRow>
						<AddInput
							type="number"
							placeholder="1"
							value={unit}
							onChange={e => this.setState({unit: e.target.value})
							}
						/>
						<AddInput
							type="number"
							placeholder="500"
							value={unitPrice}
							onChange={e => this.setState({
								unitPrice: parseInt(e.target.value),
							})
							}
						/>
					</FlexRow>
				</FlexRow>
				<FlexRow>
					<ItemComment
						placeholder="Ajoutez un commentaire ou une description de cette tâche."
						value={description}
						onChange={e => this.setState({description: e.target.value})
						}
					/>
				</FlexRow>
				<FlexRow justifyContent="space-between">
					<ActionButton
						theme="Link"
						size="XSmall"
						color={signalRed}
						onClick={() => {
							remove();
						}}
					>
						Supprimer
					</ActionButton>
					<div>
						<ActionButton
							theme="Link"
							size="XSmall"
							color={signalOrange}
							onClick={() => {
								cancel();
							}}
						>
							Annuler
						</ActionButton>
						<ActionButton
							theme="Link"
							size="XSmall"
							color={signalGreen}
							onClick={() => {
								done(this.state);
							}}
						>
							Valider
						</ActionButton>
					</div>
				</FlexRow>
			</AddItemMain>
		);
	}
}

export default AddItem;
