import React, {Component} from 'react';
import * as Yup from 'yup';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import {Formik} from 'formik';

import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import TaskStatus from '../TaskStatus';

import {UPDATE_VALIDATED_ITEM} from '../../utils/mutations.js';
import {FlexRow, FlexColumn, Button} from '../../utils/content.js';

const TaskMain = styled(FlexRow)`
	border: solid 1px;
	background: lightgrey;
`;
const TaskTextarea = styled(FormTextarea)`
	width: 100%;
`;

class TaskForm extends Component {
	updateValidatedItem = async (data, updateValidatedItem) => {
		const {task, sectionId, editItem} = this.props;

		return editItem(task.id, sectionId, data, updateValidatedItem);
	};

	render() {
		const {
			unselect,
			task: {
				name, unit, unitPrice, status, pendingUnit,
			},
		} = this.props;

		return (
			<TaskMain>
				<TaskStatus status={status} />
				<Mutation mutation={UPDATE_VALIDATED_ITEM}>
					{updateValidatedItem => (
						<Formik
							initialValues={{
								unit: pendingUnit || unit,
								comment: '',
							}}
							validationSchema={Yup.object().shape({
								unit: Yup.number().required('Required'),
								comment: Yup.string().required('Required'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								try {
									await this.updateValidatedItem(
										values,
										updateValidatedItem,
									);
								}
								catch (error) {
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg: 'Something went wrong',
									});
								}

								this.props.unselect();
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
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<FlexColumn>
											<FlexRow>
												<div>{name}</div>
												<FormInput
													{...props}
													name="unit"
													type="number"
												/>
												<div>{unitPrice}</div>
												{status
													&& status.msg && (
													<div>{status.msg}</div>
												)}
											</FlexRow>
											<TaskTextarea
												{...props}
												placeholder="Expliquez pourquoi le temps alloué à cette tâche change. C'est très important pour votre client de comprendre."
												name="comment"
												type="number"
											/>
											<FlexRow>
												<Button
													type="submit"
													disabled={isSubmitting}
												>
													Validez
												</Button>
												<Button
													onClick={unselect}
													disabled={isSubmitting}
												>
													Annulez
												</Button>
											</FlexRow>
										</FlexColumn>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</TaskMain>
		);
	}
}

export default TaskForm;
