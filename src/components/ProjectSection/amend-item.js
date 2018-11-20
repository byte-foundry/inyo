import React, {Component} from 'react';
import styled from 'react-emotion';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
	H4,
	H5,
	FlexRow,
	Input,
	Button,
	primaryBlue,
	gray20,
	signalGreen,
	signalOrange,
	signalRed,
	primaryWhite,
	ErrorInput,
	gray30,
} from '../../utils/content';

import FormElem from '../FormElem';

const AmendItemMain = styled('div')`
	background: ${gray20};
	border: 1px solid ${primaryBlue};
	padding: 10px 20px;
	font-size: 13px;
`;

const UnitPrice = styled('span')`
	padding: 15px 10px;
	width: 100px;
	margin-left: 10px;
	border-color: transparent;
	font-size: 13px;
`;

const ItemComment = styled('textarea')`
	margin-top: 10px;
	width: 100%;
	background: ${primaryWhite};
	padding: 15px 10px;
	font-family: 'Ligne';
	color: ${gray30};
	margin-bottom: 10px;
`;

const ActionButton = styled(Button)`
	font-size: 13px;
	color: ${props => props.color};
	margin-bottom: 10px;
	padding-left: 10px;
	padding-right: 10px;
`;

const AddInput = styled(Input)`
	padding: 15px 10px;
	background: ${primaryWhite};
	width: 100px;
	margin-right: 10px;
	border-color: transparent;
	font-size: 13px;
	flex: ${props => (props.full ? '2' : '1')};
`;

const AutocompleteItem = styled('div')``;

class AmendItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			name, unit, comment, pendingUnit,
		} = this.props.item;
		const {
			item, cancel, done, remove,
		} = this.props;

		return (
			<Formik
				initialValues={{
					unit: pendingUnit || unit,
					comment: '',
					name,
				}}
				validationSchema={Yup.object().shape({
					unit: Yup.number().required('Requis'),
					comment: Yup.string().required('Requis'),
					name: Yup.string().required('Requis'),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					try {
						done(values);
					}
					catch (error) {
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: 'Something went wrong',
						});
					}
				}}
			>
				{(props) => {
					const {
						values,
						touched,
						errors,
						status,
						dirty,
						isSubmitting,
						handleChange,
						handleBlur,
						handleSubmit,
						handleReset,
						setFieldValue,
					} = props;

					return (
						<form onSubmit={handleSubmit}>
							<AmendItemMain>
								<FlexRow justifyContent="space-between">
									<AddInput
										type="text"
										placeholder="Nom de la tâche"
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										name="name"
										full={true}
									/>
									<FlexRow>
										<AddInput
											type="number"
											placeholder="1"
											value={values.unit}
											onChange={handleChange}
											onBlur={handleBlur}
											name="unit"
											full={false}
										/>
									</FlexRow>
								</FlexRow>
								<FlexRow>
									<ItemComment
										placeholder="Expliquez pourquoi le temps nécessaire augmente. C'est très important pour votre client de savoir."
										value={comment}
										name="comment"
										onChange={e => setFieldValue(
											'comment',
											e.target.value,
										)
										}
									/>
									{errors.comment
										&& touched.comment && (
										<ErrorInput>
											{errors.comment}
										</ErrorInput>
									)}
								</FlexRow>
								<FlexRow justifyContent="space-between">
									<div />
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
											type="submit"
											color={signalGreen}
										>
											Valider
										</ActionButton>
									</div>
								</FlexRow>
							</AmendItemMain>
						</form>
					);
				}}
			</Formik>
		);
	}
}

export default AmendItem;
