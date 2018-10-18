import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import {cpus} from 'os';
import InlineEditable from '../InlineEditable';
import Item from './see-item';
import {H4, H5, FlexRow} from '../../utils/content';
import {REMOVE_SECTION, ADD_ITEM} from '../../utils/mutations';
import {GET_QUOTE_DATA} from '../../utils/queries';

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
			removeItem,
		} = this.props;

		return (
			<QuoteSectionMain>
				<H4>
					<InlineEditable
						value={data.name}
						type="text"
						placeholder="Section name"
						onFocusOut={(value) => {
							editSectionTitle(sectionIndex, value);
						}}
					/>
				</H4>
				{data.items.map((item, index) => (
					<Item
						key={`item${item.id}`}
						item={item}
						sectionId={data.id}
						editItem={editItem}
						removeItem={removeItem}
					/>
				))}
				<Mutation mutation={REMOVE_SECTION}>
					{removeSection => (
						<QuoteAction
							onClick={() => {
								this.props.removeSection(
									data.id,
									removeSection,
								);
							}}
						>
							Remove section
						</QuoteAction>
					)}
				</Mutation>
				<Mutation mutation={ADD_ITEM}>
					{addItem => (
						<QuoteAction
							onClick={() => {
								this.props.addItem(data.id, addItem);
							}}
						>
							Add item
						</QuoteAction>
					)}
				</Mutation>
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
