import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import {Ul, secondaryRed} from '../../utils/content';

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

class CheckList extends Component {
	render() {
		const {items, editable, onChange} = this.props;

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
							placeholder="Ajoutez les titres des contenus à récupérer et validez"
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
							placeholder="Ajoutez les titres des contenus à récupérer et validez"
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
