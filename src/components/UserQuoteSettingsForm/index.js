import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {
	Button,
	FlexRow,
	primaryWhite,
	gray20,
	ErrorInput,
} from '../../utils/content';
import FormElem from '../FormElem';
import {GET_USER_INFOS} from '../../utils/queries';

const UserQuoteSettingsFormMain = styled('div')``;

const FormContainer = styled('div')``;
const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 20px 40px;
	border: 1px solid ${gray20};
`;
const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;
`;

class UserQuoteSettingsForm extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {defaultDailyPrice, defaultVatRate} = this.props.data;

		return (
			<UserQuoteSettingsFormMain>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								defaultDailyPrice: defaultDailyPrice || 350,
								defaultVatRate: defaultVatRate || 20,
							}}
							validationSchema={Yup.object().shape({
								defaultVatRate: Yup.number(
									'Doit être un nombre',
								).required('Requis'),
								defaultDailyPrice: Yup.number(
									'Doit être un nombre',
								).required('Requis'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								console.log(values);
								try {
									updateUser({
										variables: {
											defaultVatRate:
												values.defaultVatRate,
											defaultDailyPrice:
												values.defaultDailyPrice,
										},
										update: (
											cache,
											{data: {updateUser}},
										) => {
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = updateUser;
											try {
												cache.writeQuery({
													query: GET_USER_INFOS,
													data,
												});
												ReactGA.event({
													category: 'User',
													action:
														'Updated quote settings',
												});
												this.props.done();
											}
											catch (e) {
												console.log(e);
											}
										},
									});
								}
								catch (error) {
									console.log(error);
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg: "Quelque chose s'est mal passé",
									});
								}
							}}
						>
							{(props) => {
								const {
									values,
									dirty,
									isSubmitting,
									status,
									handleSubmit,
									handleReset,
									setFieldValue,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<ProfileSection>
											<FormContainer>
												<FlexRow justifyContent="space-between">
													<FormElem
														{...props}
														name="defaultDailyPrice"
														type="number"
														label="Taux journée par défaut"
														placeholder="350"
														padded
														required
													/>
													<FormElem
														{...props}
														name="defaultVatRate"
														type="number"
														label="Taux de TVA"
														placeholder="20"
														padded
														required
													/>
												</FlexRow>
											</FormContainer>
										</ProfileSection>
										<UpdateButton
											theme="Primary"
											size="Medium"
											type="submit"
										>
											Mettre à jour
										</UpdateButton>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</UserQuoteSettingsFormMain>
		);
	}
}

export default UserQuoteSettingsForm;
