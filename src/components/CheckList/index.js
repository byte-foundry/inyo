import {css} from '@emotion/core';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {Ul} from '../../utils/content';
import {primaryBlue, secondaryRed} from '../../utils/new/design-system';
import InlineEditable from '../InlineEditable';

const ContentList = styled(Ul)`
	margin: 0;
	padding: 0;
	flex: 1;
`;

const ContentItem = styled('li')`
	display: flex;
	align-items: center;

	input {
		font-size: 14px;
		padding: 0.5rem;
	}
`;

const DeleteIcon = styled('span')`
	cursor: pointer;
	padding: 0 10px;
	color: ${secondaryRed};
`;

const placeholderCss = css`
	font-style: italic;
	font-size: 14px;
	cursor: pointer;
	padding: 0.5rem 0;

	&::before {
		content: '+';
		display: inline-block;
		color: ${primaryBlue};
		margin-right: 0.8rem;
		font-style: normal;
		font-size: 1.2rem;
	}
`;

const nameCss = css`
	padding: 0;
	margin: 0;
`;

const editableCss = css`
	margin-left: 0.8rem;
	font-size: 14px;
	border: 1px solid transparent;
`;

function CheckList({
	items, editable, onChange, ...rest
}) {
	return (
		<ContentList {...rest}>
			{items.map((item, i) => (
				<ContentItem key={item.name}>
					<input
						type="checkbox"
						checked={item.checked}
						onChange={(e) => {
							onChange({
								items: [
									...items.slice(0, i),
									{...item, checked: e.target.checked},
									...items.slice(i + 1),
								],
							});
						}}
					/>
					<InlineEditable
						disabled={!editable}
						value={item.name}
						type="text"
						for="checkList"
						placeholder={
							<fbt
								project="inyo"
								desc="add requested document placeholder"
							>
								Ajoutez les titres des documents et appuyez sur
								entrée
							</fbt>
						}
						placeholderCss={placeholderCss}
						nameCss={nameCss}
						editableCss={editableCss}
						onFocusOut={(value) => {
							if (!value) {
								onChange({
									items: [
										...items.slice(0, i),
										...items.slice(i + 1),
									],
								});
								return;
							}

							onChange({
								items: [
									...items.slice(0, i),
									{...item, name: value},
									...items.slice(i + 1),
								],
							});
						}}
					/>
					{editable && (
						<DeleteIcon
							onClick={() => {
								onChange({
									items: [
										...items.slice(0, i),
										...items.slice(i + 1),
									],
								});
							}}
						>
							&times;
						</DeleteIcon>
					)}
				</ContentItem>
			))}
			{editable && (
				<ContentItem>
					<InlineEditable
						type="text"
						size="small"
						placeholder={
							<fbt
								project="inyo"
								desc="add requested document placeholder"
							>
								Ajoutez les titres des documents et appuyez sur
								entrée
							</fbt>
						}
						placeholderCss={placeholderCss}
						nameCss={nameCss}
						editableCss={editableCss}
						onFocusOut={(value) => {
							if (value) {
								onChange({
									items: items.concat({
										checked: false,
										name: value,
									}),
								});
							}
							return true;
						}}
					/>
				</ContentItem>
			)}
		</ContentList>
	);
}

CheckList.defaultProps = {
	items: [],
	editable: true,
	onChange: () => {},
};

CheckList.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			checked: PropTypes.bool,
			name: PropTypes.string,
		}),
	),
	editable: PropTypes.bool,
	onChange: PropTypes.func,
};

export default CheckList;
