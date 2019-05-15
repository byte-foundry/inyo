import React, {useState} from 'react';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Plural from '../Plural';
import Tag from '../Tag';
import FormElem from '../FormElem';

import {
	accentGrey,
	primaryBlack,
	primaryRed,
	Button,
} from '../../utils/new/design-system';
import {ReactComponent as PencilIcon} from '../../utils/icons/pencil.svg';
import {ReactComponent as TrashIcon} from '../../utils/icons/trash-icon.svg';

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

const EditIcon = styled(PencilIcon)`
	width: 18px;
	padding: 0 5px;
	cursor: pointer;

	path {
		fill: ${accentGrey};
	}

	&:hover path {
		fill: ${primaryBlack};
	}
`;

const DeleteIcon = styled(TrashIcon)`
	cursor: pointer;

	path {
		fill: ${accentGrey};
	}

	&:hover path {
		fill: ${primaryRed};
	}
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

	return (
		<>
			<TagLine>
				<TagName>
					<Tag tag={tag} />
				</TagName>
				<TagItemsNumber>
					{tag.items.length > 0 && (
						<>
							{tag.items.length}{' '}
							<Plural
								value={tag.items.length}
								singular="tâche"
								plural="tâches"
							/>{' '}
							avec ce tag
						</>
					)}
				</TagItemsNumber>
				<TagActions>
					<EditIcon onClick={() => setIsEditing(true)} />
					<DeleteIcon />
				</TagActions>
			</TagLine>
			{isEditing && (
				<TagLine>
					<Formik
						initialValues={{
							name: tag.name,
							colorBg: tag.colorBg,
							colorText: tag.colorText,
						}}
						validateSchema={Yup.object().shape({
							name: Yup.string().required('Requis'),
							colorBg: Yup.string().matches(/#[0-9a-fA-F]{6}/),
							colorText: Yup.string().matches(/#[0-9a-fA-F]{6}/),
						})}
					>
						{(props) => {
							const {handleSubmi, isSubmitting} = props;

							return (
								<TagFormElem onSubmit={() => {}}>
									<TagFormField>
										<FormElem
											{...props}
											name="name"
											label="Nom"
										/>
									</TagFormField>
									<TagFormField>
										<ShowColor
											color={props.values.colorBg}
										/>
										<FormElem
											{...props}
											name="colorBg"
											label="Couleur fond"
										/>
									</TagFormField>
									<TagFormField>
										<ShowColor
											color={props.values.colorText}
										/>
										<FormElem
											{...props}
											name="colorText"
											label="Couleur texte"
										/>
									</TagFormField>
									<TagLine>
										<Button
											type="button"
											link
											grey
											onClick={() => setIsEditing(false)}
										>
											Annuler
										</Button>
										<Button disabled={isSubmitting} primary>
											Enregistrer
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
