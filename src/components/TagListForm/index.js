import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import {Formik} from 'formik';
import React from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {TAG_COLOR_PALETTE} from '../../utils/constants';
import {FlexRow, Loading} from '../../utils/content';
import {CREATE_TAG} from '../../utils/mutations';
import {Button, P} from '../../utils/new/design-system';
import {GET_USER_TAGS} from '../../utils/queries';
import FormElem from '../FormElem';
import TagForm from '../TagForm';

const TagEmptyContainer = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const InputRow = styled(FlexRow)`
	width: 640px;
`;

const InputContainer = styled('div')`
	flex: 1;
	margin-right: 30px;
`;

const CreateTagFormContainer = styled('div')`
	margin-left: -16px;
	margin-top: 1rem;
`;

const ButtonInRow = styled(Button)`
	height: 40px;
	margin-bottom: 20px;
	align-self: flex-end;
`;

function CreateTagForm({tags}) {
	const [createTag] = useMutation(CREATE_TAG);

	return (
		<Formik
			initialValues={{name: ''}}
			validationSchema={Yup.object().shape({
				name: Yup.string().required(
					<fbt project="inyo" desc="required">
						Requis
					</fbt>,
				),
			})}
			onSubmit={async (values, actions) => {
				try {
					const [colorBg, colorText] = TAG_COLOR_PALETTE[
						tags.length % TAG_COLOR_PALETTE.length
					].map(
						color => `#${color
							.map(p => p.toString(16).padStart(2, '0'))
							.join('')}`,
					);

					await createTag({
						variables: {
							name: values.name,
							colorBg,
							colorText,
						},
					});
				}
				catch (err) {
					if (
						err.networkError
						&& err.networkError.result
						&& err.networkError.result.errors
					) {
						Sentry.captureException(err.networkError.result.errors);
					}
					else {
						Sentry.captureException(err);
					}
					actions.setSubmitting(false);
					actions.setErrors(err);
					actions.setStatus({
						msg: (
							<fbt project="inyo" desc="something went wrong">
								Quelque chose ne s'est pas passé comme prévu
							</fbt>
						),
					});
				}
			}}
		>
			{(props) => {
				const {isSubmitting, handleSubmit} = props;

				return (
					<form onSubmit={handleSubmit}>
						<InputRow>
							<InputContainer>
								<FormElem
									{...props}
									name="name"
									label={
										<fbt
											project="inyo"
											desc="tag name tag list form label"
										>
											Nom du tag
										</fbt>
									}
									placeholder={
										<fbt
											project="inyo"
											desc="tag name tag list form placeholder"
										>
											Administratif
										</fbt>
									}
									required
									big
								/>
							</InputContainer>
							<ButtonInRow
								disabled={isSubmitting}
								type="submit"
								size="big"
							>
								<fbt project="inyo" desc="create tag">
									Créer un tag
								</fbt>
							</ButtonInRow>
						</InputRow>
					</form>
				);
			}}
		</Formik>
	);
}

function TagListForm() {
	const {data, loading, error} = useQuery(GET_USER_TAGS);

	if (loading) return <Loading />;
	if (error) throw error;

	return (
		<div>
			{data.me.tags.length === 0 && (
				<>
					<TagEmptyContainer>
						<P>
							<fbt project="inyo" desc="no tag message 1st part">
								Vous n'avez pas encore créé de tags.
							</fbt>
							<br />
							<fbt project="inyo" desc="no tag message 2nd part">
								Créer votre premier et commencer a classer vos
								tâches.
							</fbt>
						</P>
					</TagEmptyContainer>
					<CreateTagForm tags={data.me.tags} />
				</>
			)}
			{data.me.tags.length > 0 && (
				<>
					<CreateTagFormContainer>
						<CreateTagForm tags={data.me.tags} />
					</CreateTagFormContainer>
					{data.me.tags.map(tag => (
						<TagForm tag={tag} />
					))}
				</>
			)}
		</div>
	);
}

export default TagListForm;
