import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {useState} from 'react';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {REMOVE_TAG, UPDATE_TAG} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import FormElem from '../FormElem';
import IconButton from '../IconButton';
import Tag from '../Tag';

const TagLine = styled('div')`
	display: flex;
	margin: 1rem 0;
`;

const TagName = styled('div')`
	flex: 1;
`;

const TagItemsNumber = styled('div')`
	flex: 1;
	display: flex;
	align-items: center;
`;

const TagActions = styled('div')`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const TagFormElem = styled('form')`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

const TagFormField = styled('div')`
	margin-right: 2rem;
	display: flex;
	align-items: flex-end;
`;

const ShowColor = styled('div')`
	background: ${props => props.color};
	flex: 0 0 27px;
	height: 27px;
	margin-bottom: 20px;
	margin-right: 1rem;
	border-radius: 3px;
`;

function TagForm({tag}) {
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [updateTag] = useMutation(UPDATE_TAG);
	const [removeTag] = useMutation(REMOVE_TAG);

	return (
		<>
			<TagLine>
				<TagName>
					<Tag tag={tag} />
				</TagName>
				<TagItemsNumber>
					{tag.items.length > 0 && (
						<>
							<fbt project="inyo" desc="task per tag info">
								<fbt:plural
									name="task per tag count"
									count={tag.items.length}
									many="tâches"
									showCount="yes"
								>
									tâche
								</fbt:plural>{' '}
								avec ce tag
							</fbt>
						</>
					)}
				</TagItemsNumber>
				<TagActions>
					<IconButton
						icon="edit"
						size="tiny"
						onClick={() => {
							setIsEditing(true);
							setIsDeleting(false);
						}}
					/>
					<IconButton
						icon="delete_forever"
						size="tiny"
						danger
						onClick={() => {
							setIsDeleting(true);
							setIsEditing(false);
						}}
					/>
				</TagActions>
			</TagLine>
			{isDeleting && (
				<TagLine>
					<Button
						type="button"
						link
						grey
						aligned
						onClick={() => {
							setIsDeleting(false);
						}}
					>
						<fbt project="inyo" desc="cancel delete tag">
							Annuler
						</fbt>
					</Button>
					<Button
						type="submit"
						red
						onClick={() => {
							removeTag({
								variables: {
									id: tag.id,
								},
								optimisticResponse: {
									removeTag: {
										id: tag.id,
									},
								},
							});
							setIsDeleting(false);
						}}
					>
						<fbt project="inyo" desc="confirm delete tag">
							Supprimer le tag
						</fbt>
					</Button>
				</TagLine>
			)}
			{isEditing && (
				<TagLine>
					<Formik
						initialValues={{
							name: tag.name,
							colorBg: tag.colorBg,
							colorText: tag.colorText,
						}}
						validateSchema={Yup.object().shape({
							name: Yup.string().required(
								<fbt project="inyo" desc="required">
									Requis
								</fbt>,
							),
							colorBg: Yup.string().matches(/#[0-9a-fA-F]{6}/),
							colorText: Yup.string().matches(/#[0-9a-fA-F]{6}/),
						})}
						onSubmit={async (values, actions) => {
							actions.setSubmitting(false);
							try {
								await updateTag({
									variables: {
										id: tag.id,
										...values,
									},
									optimisticResponse: {
										createTag: {
											id: tag.id,
											...values,
										},
									},
								});
								setIsEditing(false);
							}
							catch (error) {
								actions.setSubmitting(false);
								actions.setErrors(error);
								actions.setStatus({
									msg: (
										<fbt
											project="inyo"
											desc="something went wrong"
										>
											Un problème c'est produit
										</fbt>
									),
								});
							}
						}}
					>
						{(props) => {
							const {handleSubmit, isSubmitting} = props;

							return (
								<TagFormElem onSubmit={handleSubmit}>
									<TagFormField>
										<FormElem
											{...props}
											name="name"
											label={
												<fbt
													project="inyo"
													desc="tag name"
												>
													Nom
												</fbt>
											}
										/>
									</TagFormField>
									<TagFormField>
										<ShowColor
											color={props.values.colorBg}
										/>
										<FormElem
											{...props}
											name="colorBg"
											label={
												<fbt
													project="inyo"
													desc="tag background color"
												>
													Couleur fond
												</fbt>
											}
										/>
									</TagFormField>
									<TagFormField>
										<ShowColor
											color={props.values.colorText}
										/>
										<FormElem
											{...props}
											name="colorText"
											label={
												<fbt
													project="inyo"
													desc="tag text color"
												>
													Couleur texte
												</fbt>
											}
										/>
									</TagFormField>
									<TagLine>
										<Button
											type="button"
											link
											grey
											aligned
											onClick={() => {
												setIsEditing(false);
											}}
										>
											<fbt
												project="inyo"
												desc="cancel tag create"
											>
												Annuler
											</fbt>
										</Button>
										<Button
											type="submit"
											disabled={isSubmitting}
											primary
										>
											<fbt
												project="inyo"
												desc="confirm tag create"
											>
												Enregistrer
											</fbt>
										</Button>
									</TagLine>
								</TagFormElem>
							);
						}}
					</Formik>
				</TagLine>
			)}
		</>
	);
}

export default TagForm;
