import React, {Component} from 'react';
import styled from 'react-emotion';
import InlineEditable from '../InlineEditable';
import Item from './see-item';
import {H4, H5, FlexRow} from '../../utils/content';

const QuoteSectionMain = styled('div')``;
const QuoteAction = styled('button')``;
const ItemName = styled(H5)`
	margin: 0;
`;

class QuoteSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddItem: false,
		};
	}

	render() {
		const {
			data,
			addItem,
			editSectionTitle,
			editItem,
			sectionIndex,
			removeSection,
			removeItem,
		} = this.props;

		return (
			<QuoteSectionMain>
				<H4>
					<InlineEditable
						value={data.title}
						type="text"
						placeholder="Section name"
						onFocusOut={(value) => {
							editSectionTitle(sectionIndex, value);
						}}
					/>
				</H4>
				{data.items.map((item, index) => (
					<Item
						item={item}
						sectionIndex={sectionIndex}
						itemIndex={index}
						editItem={editItem}
						removeItem={removeItem}
					/>
				))}
				<QuoteAction onClick={removeSection}>
					Remove section
				</QuoteAction>
				<QuoteAction onClick={addItem}>Add item</QuoteAction>
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
