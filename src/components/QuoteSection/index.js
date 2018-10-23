import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import {cpus} from 'os';
import InlineEditable from '../InlineEditable';
import Item from './see-item';
import {
	H4,
	H5,
	FlexRow,
	Button,
	primaryNavyBlue,
	primaryBlue,
	signalRed,
} from '../../utils/content';
import {REMOVE_SECTION, ADD_ITEM, UPDATE_SECTION} from '../../utils/mutations';
import {GET_QUOTE_DATA} from '../../utils/queries';

const QuoteSectionMain = styled('div')``;
const QuoteAction = styled(Button)`
	text-decoration: none;
	margin-right: 10px;
	color: ${props => (props.type === 'delete' ? signalRed : primaryBlue)};
	font-size: 11px;
	transform: translateY(18px);
`;
const ItemName = styled(H5)`
	margin: 0;
`;
const SectionTitle = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 10px 0;
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
			mode,
		} = this.props;

		return (
			<QuoteSectionMain>
				<FlexRow justifyContent="space-between">
					<SectionTitle>
						<Mutation mutation={UPDATE_SECTION}>
							{updateSection => (
								<InlineEditable
									value={data.name}
									type="text"
									placeholder="Section name"
									onFocusOut={(value) => {
										editSectionTitle(
											data.id,
											value,
											updateSection,
										);
									}}
								/>
							)}
						</Mutation>
					</SectionTitle>
					{mode === 'edit' && (
						<div>
							<Mutation mutation={REMOVE_SECTION}>
								{removeSection => (
									<QuoteAction
										theme="Link"
										size="XSmall"
										type="delete"
										onClick={() => {
											this.props.removeSection(
												data.id,
												removeSection,
											);
										}}
									>
										Supprimer la section
									</QuoteAction>
								)}
							</Mutation>
							<Mutation mutation={ADD_ITEM}>
								{addItem => (
									<QuoteAction
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.addItem(
												data.id,
												addItem,
											);
										}}
									>
										Ajouter une tâche
									</QuoteAction>
								)}
							</Mutation>
						</div>
					)}
				</FlexRow>

				{data.items.map((item, index) => (
					<Item
						key={`item${item.id}`}
						item={item}
						sectionId={data.id}
						editItem={editItem}
						removeItem={removeItem}
						mode={mode}
					/>
				))}
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
