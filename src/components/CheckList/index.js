import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import {Ul} from '../../utils/content';

import InlineEditable from '../InlineEditable';

const ContentList = styled(Ul)`
	padding: 0;
`;

const ContentItem = styled('li')`
	display: flex;
	align-items: baseline;
`;

class CheckList extends Component {
	render() {
		const {items, onChange} = this.props;

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
							value={item.name}
							type="text"
							placeholder="Ajouter le titre du contenu à récupérer"
							onFocusOut={(value) => {
								onChange({
									items: [
										...items.slice(0, i),
										{...item, name: value},
										...items.slice(i + 1),
									],
								});
							}}
						/>
					</ContentItem>
				))}
				<ContentItem>
					<InlineEditable
						type="text"
						placeholder="Ajouter le titre du contenu à récupérer"
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
			</ContentList>
		);
	}
}

CheckList.defaultProps = {
	items: [],
	onChange: () => {},
};

CheckList.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			checked: PropTypes.bool,
			name: PropTypes.string,
		}),
	),
	onChange: PropTypes.func,
};

export default CheckList;
