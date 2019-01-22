import React, {Component} from 'react';
import styled from '@emotion/styled';
import Autocomplete from 'react-autocomplete';
import * as Yup from 'yup';
import {Query} from 'react-apollo';
import {Formik} from 'formik';

import {
	FlexRow,
	Button,
	primaryBlue,
	signalGreen,
	signalOrange,
	signalRed,
	primaryWhite,
	gray80,
	gray70,
	gray30,
	Loading,
} from '../../utils/content';

import {GET_ITEMS} from '../../utils/queries';

import SwitchButton from '../SwitchButton';
import FormCheckbox from '../FormCheckbox';
import CheckList from '../CheckList';
import UnitInput from '../UnitInput';

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
	padding: 15px;
	font-family: 'Work Sans';
	color: ${gray70};
	border: solid 1px ${gray30};
	font-size: 0.8rem;
	line-height: 1.8;
`;

const ActionButton = styled(Button)`
	font-size: 13px;
	color: ${props => props.color};
	margin: 15px 0 10px;
	padding: 0 10px;
`;

const AddUnitInput = styled(UnitInput)`
	padding: 15px 10px;
	background: ${primaryWhite};
	width: 100px;
	margin-left: 10px;
	border: solid 1px ${gray30};
	font-size: 13px;
`;

class AddItem extends Component {
	render() {
		const {
			item, cancel, done, remove,
		} = this.props;

		let {description: initialDescription} = item;

		// parse the description for the file list
		let initialFiles = [];
		const fileListRegex = /([\s\S])+# content-acquisition-list\n([^#]+)$/;

		if (fileListRegex.test(item.description)) {
			const matches = item.description
				.match(fileListRegex)[0]
				.split('# content-acquisition-list');

			const fileItemRegex = /- \[([ x])\] (.+)/;

			initialFiles = matches
				.pop()
				.split('\n')
				.filter(line => fileItemRegex.test(line))
				.map(line => ({
					checked: /^- \[[x]]/.test(line),
					name: line.match(fileItemRegex).pop(),
				}));
			initialDescription = matches.join('# content-acquisition-list');
		}

		return (
			<AddItemMain>
				<Formik
					initialValues={{
						...item,
						description: initialDescription,
						files: initialFiles,
						isContentAcquisition:
							item.type === 'CONTENT_ACQUISITION',
					}}
					validationSchema={Yup.object().shape({
						name: Yup.string().required('Requis'),
						unit: Yup.number().required('Requis'),
						description: Yup.string(),
						reviewer: Yup.string().required('Requis'),
						isContentAcquisition: Yup.boolean().required('Requis'),
						files: Yup.mixed().when('isContentAcquisition', {
							is: true,
							then: Yup.array()
								.required(
									'Vous devez spécifier au moins un fichier',
								)
								.of(
									Yup.object({
										checked: Yup.boolean(),
										name: Yup.string().required(
											'Le nom est requis',
										),
									}),
								),
							otherwise: Yup.array().ensure(),
						}),
					})}
					onSubmit={({isContentAcquisition, files, ...values}) => {
						if (isContentAcquisition) {
							values.description = values.description.concat(
								`\n# content-acquisition-list\n${files
									.map(
										({checked, name}) => `- [${
											checked ? 'x' : ' '
										}] ${name}`,
									)
									.join('\n')}`,
							);
						}

						done({
							...values,
							unit: parseFloat(values.unit) || 0,
							type: isContentAcquisition
								? 'CONTENT_ACQUISITION'
								: 'DEFAULT',
						});
					}}
				>
					{(props) => {
						const {
							handleSubmit,
							setFieldValue,
							handleChange,
							values: {
								name,
								unit,
								description,
								reviewer,
								isContentAcquisition,
								files,
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
										value={reviewer}
										onChange={(value) => {
											setFieldValue('reviewer', value);
										}}
									/>
									<FormCheckbox
										{...props}
										name="isContentAcquisition"
										type="checkbox"
										label="Récupération contenu"
										onChange={(e) => {
											if (e.target.checked) {
												setFieldValue(
													'reviewer',
													'CUSTOMER',
												);
											}
										}}
									/>
								</FlexRow>
								<FlexRow justifyContent="space-between">
									<Query query={GET_ITEMS}>
										{({loading, error, data}) => {
											if (error) {
												throw new Error(error);
											}
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
														getItemValue={itemValue => itemValue
														}
														items={items}
														shouldItemRender={(
															itemRender,
															value,
														) => itemRender.includes(
															value,
														)
														}
														renderItem={(
															itemToRender,
															isHighlighted,
														) => (
															<div
																background={
																	isHighlighted
																		? 'lightgray'
																		: 'white'
																}
															>
																{itemToRender}
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
																color: gray80,
																border: `solid 1px ${gray30}`,
																background: primaryWhite,
																fontSize:
																	'13px',
																fontFamily:
																	'Work Sans',
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
										<AddUnitInput
											type="number"
											placeholder="1"
											value={unit}
											onChange={({value}) => setFieldValue('unit', value)
											}
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
								{isContentAcquisition && (
									<FlexRow>
										<CheckList
											items={files}
											onChange={({items}) => {
												setFieldValue('files', items);
											}}
										/>
									</FlexRow>
								)}
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
											type="submit"
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
