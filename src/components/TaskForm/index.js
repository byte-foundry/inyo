import React, {Component} from 'react';
import * as Yup from 'yup';
import styled from 'react-emotion';
import {Formik} from 'formik';

import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import TaskStatus from '../TaskStatus';

import {FlexRow, FlexColumn, Button} from '../../utils/content.js';

const TaskMain = styled(FlexRow)`
	border: solid 1px;
	background: lightgrey;
`;
const TaskTextarea = styled(FormTextarea)`
	width: 100%;
`;

class TaskForm extends Component {
	render() {
		const {
			done,
			cancel,
			task: {
				name, time, price, status,
			},
		} = this.props;

		return (
			<TaskMain>
				<TaskStatus status={status} />
				<Formik
					initialValues={{name, time, price}}
					validationSchema={Yup.object().shape({
						name: Yup.string().required('Required'),
						time: Yup.number().required('Required'),
						price: Yup.number().required('Required'),
					})}
					onSubmit={done}
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
										<FormInput
											{...props}
											name="name"
											type="text"
											placeholder="Donnez un nom a votre tâche"
										/>
										<FormInput
											{...props}
											name="time"
											type="number"
										/>
										<FormInput
											{...props}
											name="price"
											type="number"
										/>
										{status
											&& status.msg && (
											<div>{status.msg}</div>
										)}
									</FlexRow>
									<TaskTextarea
										{...props}
										placeholder="Ajoutez un commentaire ou une description"
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
											onClick={cancel}
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
			</TaskMain>
		);
	}
}

export default TaskForm;
