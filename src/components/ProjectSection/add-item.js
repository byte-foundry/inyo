import React, {Component} from 'react';
import styled from 'react-emotion';
import Autocomplete from 'react-autocomplete';
import * as Yup from 'yup';
import {Query} from 'react-apollo';
import {Formik} from 'formik';

import {
	FlexRow,
	Input,
	Button,
	primaryBlue,
	signalGreen,
	signalOrange,
	signalRed,
	primaryWhite,
	gray30,
	gray80,
	Loading,
} from '../../utils/content';

import {GET_ITEMS} from '../../utils/queries';

import SwitchButton from '../SwitchButton';

const AddItemMain = styled('div')`
	background: ${primaryWhite};
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
	border: solid 1px ${gray80};
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
	border: solid 1px ${gray80};
	font-size: 13px;
`;

class AddItem extends Component {
	render() {
		const {
			item: {
				name, unit, description, reviewer,
			},
			cancel,
			done,
			remove,
		} = this.props;

		return (
			<AddItemMain>
				<Formik
					initialValues={{
						name,
						unit,
						description,
						reviewer,
					}}
					validationSchema={Yup.object().shape({
						name: Yup.string().required('Requis'),
						unit: Yup.number().required('Requis'),
						description: Yup.string(),
						reviewer: Yup.string().required('Requis'),
					})}
					onSubmit={(values, actions) => {
						done(values);
					}}
				>
					{(props) => {
						const {
							handleSubmit,
							setFieldValue,
							handleChange,
							values: {
								name, unit, description, reviewer,
							},
						} = props;

						return (
							<div>
								<FlexRow>
									<SwitchButton
										left={{
											label: 'Vous exécutez la tâche',
											value: 'USER',
										}}
										right={{
											label:
												'Votre client exécute la tâche',
											value: 'CUSTOMER',
										}}
										name="reviewer"
										setFieldValue={setFieldValue}
										value={reviewer}
									/>
								</FlexRow>
								<FlexRow justifyContent="space-between">
									<Query query={GET_ITEMS}>
										{({loading, error, data}) => {
											if (loading) {
												return <Loading />;
											}
											if (
												!loading
												&& data
												&& data.template
											) {
												const {items} = data.template;

												return (
													<Autocomplete
														getItemValue={item => item
														}
														items={items}
														shouldItemRender={(
															item,
															value,
														) => item.includes(value)
														}
														renderItem={(
															item,
															isHighlighted,
														) => (
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
														onChange={handleChange}
														onSelect={(value) => {
															setFieldValue(
																'name',
																value,
															);
														}}
														wrapperStyle={{
															flex: '2',
															marginRight: '20px',
														}}
														menuStyle={{
															borderRadius: '0px',
															boxShadow:
																'0 2px 12px rgba(0, 0, 0, 0.1)',
															background:
																'rgb(255, 255, 255)',
															padding: '2px 0',
															fontSize: '11px',
															position: 'fixed',
															overflow: 'auto',
															maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
														}}
														inputProps={{
															name: 'name',
															style: {
																color: gray30,
																border: `solid 1px ${gray80}`,
																background: primaryWhite,
																fontSize:
																	'13px',
																fontFamily:
																	'Ligne',
																width: '100%',
																padding:
																	'16px 10px',
															},
														}}
													/>
												);
											}

											throw new Error(error);
										}}
									</Query>
									<FlexRow>
										<AddInput
											type="number"
											name="unit"
											placeholder="1"
											value={unit}
											onChange={handleChange}
										/>
									</FlexRow>
								</FlexRow>
								<FlexRow>
									<ItemComment
										placeholder="Ajoutez un commentaire ou une description de cette tâche."
										value={description}
										name="description"
										onChange={handleChange}
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
										{typeof cancel === 'function' && (
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
										)}
										<ActionButton
											theme="Link"
											size="XSmall"
											color={signalGreen}
											onClick={handleSubmit}
										>
											Valider
										</ActionButton>
									</div>
								</FlexRow>
							</div>
						);
					}}
				</Formik>
			</AddItemMain>
		);
	}
}

export default AddItem;
