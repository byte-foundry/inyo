import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import {cpus} from 'os';
import InlineEditable from '../InlineEditable';
import Item from './see-item';
import AddItem from './add-item';
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
	padding: 0;
	color: ${props => (props.type === 'delete' ? signalRed : primaryBlue)};
	font-size: 11px;
	transform: translateY(18px);
	margin: ${props => (props.type === 'delete' ? '50px 0 25px;' : '0 0 10px 0;')};
`;
const ItemName = styled(H5)`
	margin: 0;
`;
const SectionTitle = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 50px 0 25px;
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
			editSectionTitle,
			editItem,
			removeItem,
			mode,
			customerViewMode,
			refetch,
			defaultDailyPrice,
			quoteStatus,
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
									disabled={mode !== 'edit'}
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
						refetch={refetch}
						quoteStatus={quoteStatus}
					/>
				))}
				{this.state.shouldDisplayAddItem && (
					<Mutation mutation={ADD_ITEM}>
						{addItem => (
							<AddItem
								item={{
									name: 'Nouvelle tâche',
									unit: 0,
									unitPrice: defaultDailyPrice,
									description: '',
								}}
								remove={() => {
									this.setState({
										shouldDisplayAddItem: false,
									});
								}}
								done={(values) => {
									this.props.addItem(
										data.id,
										values,
										addItem,
									);
									this.setState({
										shouldDisplayAddItem: false,
									});
								}}
							/>
						)}
					</Mutation>
				)}

				{!customerViewMode
					&& quoteStatus !== 'SENT' && (
					<QuoteAction
						theme="Link"
						size="XSmall"
						onClick={() => {
							this.setState({
								shouldDisplayAddItem: true,
							});
						}}
					>
							Ajouter une tâche
					</QuoteAction>
				)}
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
