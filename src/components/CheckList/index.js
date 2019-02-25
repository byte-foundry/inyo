import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {Ul, secondaryRed, primaryBlue} from '../../utils/content';

import InlineEditable from '../InlineEditable';

const ContentList = styled(Ul)`
	padding: 0;
	flex: 1;
`;

const ContentItem = styled('li')`
	display: flex;
	align-items: baseline;
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
	padding: 5px 10px;
	margin: 5px 20px;
`;

const editableCss = css`
	padding: 0 0 0 0.8rem;
	font-size: 14px;
`;

function CheckList({items, editable, onChange}) {
	return (
		<ContentList>
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
						placeholder="Ajoutez les titres des contenus à récupérer et validez"
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
						placeholder="Ajoutez les titres des contenus à récupérer et validez"
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
								return true;
							}
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
