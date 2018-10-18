import React, {Component} from 'react';
import styled from 'react-emotion';
import {withRouter} from 'react-router-dom';
import {Mutation, Query} from 'react-apollo';
import TextEditor from '../../../components/TextEditor';
import InlineEditable from '../../../components/InlineEditable';
import QuoteSection from '../../../components/QuoteSection';
import QuoteTotal from '../../../components/QuoteTotal';
import {templates} from '../../../utils/quote-templates';
import {
	EDIT_ITEMS,
	UPDATE_QUOTE,
	ADD_SECTION,
	UPDATE_OPTION,
	SEND_QUOTE,
} from '../../../utils/mutations';
import {GET_QUOTE_DATA} from '../../../utils/queries';
import {
	H1,
	H3,
	H5,
	H4,
	H6,
	P,
	FlexRow,
	FlexColumn,
} from '../../../utils/content';

const EditQuoteMain = styled('div')`
	min-height: 600px;
`;

const Select = styled('select')``;
const Button = styled('button')``;
const ToggleButton = styled('span')`
	color: ${props => (props.active ? 'black' : 'grey')};
	cursor: pointer;
	margin-right: 20px;
`;
const AddOptionButton = styled('button')``;
const ClientAddress = styled('div')``;
const QuoteSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 15vw;
	border: 1px solid black;
	padding: 20px 40px;
`;

const CenterContent = styled(FlexColumn)`
	border: 1px solid black;
	padding: 20px 40px;
`;

class EditQuote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'quote',
			selectedOption: undefined,
			apolloTriggerRenderTemporaryFix: false,
		};
	}

	setQuoteData = (templateName, EditItems) => {
		const templateData = templates.find(e => e.name === templateName);

		if (templateData) {
			const items = templateData.sections.flatMap(section => section.items.map(item => item.name));

			if (typeof EditItemItems === 'function') {
				EditItems({variables: {items}});
			}
			this.setState({quoteData: templateData});
		}
		else {
			this.setState({
				quoteData: {
					name: '',
					proposal: undefined,
					sections: [],
				},
			});
			if (typeof EditItemItems === 'function') {
				EditItems({variables: {items: []}});
			}
		}
	};

	getQuoteTotal = (option) => {
		let sumDays = 0;
		let sumHT = 0;
		let sumTTC = 0;

		option.sections.forEach((section) => {
			section.items.forEach((item) => {
				sumDays += item.unit;
				sumHT += item.unitPrice;
				sumTTC
					+= item.unitPrice + item.unitPrice * (item.vatRate / 100);
			});
		});
		return <QuoteTotal sumDays={sumDays} sumHT={sumHT} sumTTC={sumTTC} />;
	};

	sendQuote = (quoteId, sendQuote) => {
		sendQuote({
			variables: {quoteId},
			update: (cache, {data: {sendQuote}}) => {
				this.props.router.push('/app/quotes');
			},
		});
	};

	editQuoteTitle = (title, quoteId, updateQuote) => {
		updateQuote({
			variables: {quoteId, name: title},
			update: (cache, {data: {updateQuote}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});

				data.quote.name = updateQuote.name;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	updateOption = (optionId, raw, updateOption) => {
		updateOption({
			variables: {optionId, proposal: raw},
			update: (cache, {data: {updateOption}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});

				data.quote.options[0].proposal = updateOption.proposal;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	addItem = (sectionId, addItem) => {
		addItem({
			variables: {sectionId, name: 'Nouvelle tâche'},
			update: (cache, {data: {addItem}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === sectionId,
				);

				section.items.push(addItem);
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	editItem = (itemId, sectionId, data, updateItem) => {
		const {
			name, description, unitPrice, unit, vatRate,
		} = data;

		updateItem({
			variables: {
				itemId,
				name,
				description,
				unitPrice,
				unit,
				vatRate,
			},
			optimisticResponse: {
				__typename: 'Mutation',
				updateItem: {
					id: itemId,
					name,
					unitPrice,
					unit,
					vatRate,
					description,
					__typename: 'Item',
				},
			},
			update: (cache, {data: {updateItem}}) => {
				console.log(updateItem);
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updateItem.id,
				);

				section.items[itemIndex] = updateItem;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	removeItem = (itemId, sectionId, removeItem) => {
		removeItem({
			variables: {itemId},
			update: (cache, {data: {removeItem}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === removeItem.id,
				);

				section.items.splice(itemIndex, 1);
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	addSection = (optionId, addSection) => {
		addSection({
			variables: {optionId, name: 'Nouvelle section'},
			update: (cache, {data: {addSection}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});

				data.quote.options[0].sections.push(addSection);
				console.log(addSection);
				console.log(data);
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	editSectionTitle = (sectionId, name, updateSection) => {
		updateSection({
			variables: {sectionId, name},
			update: (cache, {data: {updateSection}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const sectionIndex = data.quote.options[0].sections.findIndex(
					e => e.id === sectionId,
				);

				data.quote.options[0].sections[sectionIndex] = updateSection;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	removeSection = (sectionId, removeSection) => {
		removeSection({
			variables: {sectionId},
			update: (cache, {data: {removeSection}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const sectionIndex = data.quote.options[0].sections.findIndex(
					e => e.id === removeSection.id,
				);

				data.quote.options[0].sections.splice(sectionIndex, 1);
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	render() {
		const {quoteId} = this.props.match.params;

		return (
			<Query query={GET_QUOTE_DATA} variables={{quoteId}}>
				{({loading, error, data}) => {
					const fetchedData = {...data};

					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;
					const {quote} = data;

					if (!this.state.selectedOption) {
						this.setState({
							selectedOption: quote.options[0].name,
						});
						return null;
					}
					if (this.state.apolloTriggerRenderTemporaryFix) {
						this.setState({
							apolloTriggerRenderTemporaryFix: false,
						});
					}
					const option = quote.options.find(
						o => o.name === this.state.selectedOption,
					);

					return (
						<EditQuoteMain>
							<FlexRow justifyContent="space-between">
								<H1>Fill your quote data</H1>
								<Mutation mutation={SEND_QUOTE}>
									{sendQuote => (
										<Button
											onClick={() => {
												this.sendQuote(
													quote.id,
													sendQuote,
												);
											}}
										>
											Send proposal
										</Button>
									)}
								</Mutation>
							</FlexRow>
							<FlexRow>
								<H3>
									<Mutation mutation={UPDATE_QUOTE}>
										{updateQuote => (
											<InlineEditable
												value={quote.name}
												type="text"
												placeholder="Name of the project"
												onFocusOut={(value) => {
													this.editQuoteTitle(
														value,
														quote.id,
														updateQuote,
													);
												}}
											/>
										)}
									</Mutation>
								</H3>
							</FlexRow>
							<FlexRow justifyContent="space-between">
								<SideActions justifyContent="space-between">
									<div>
										<div>
											<label>Template</label>
										</div>
										<div>
											<Mutation mutation={EDIT_ITEMS}>
												{EditItems => (
													<Select
														onChange={(e) => {
															this.setQuoteData(
																e.target.value,
																EditItems,
															);
														}}
													>
														{templates.map(
															template => (
																<option
																	key={`option${
																		option.name
																	}`}
																	value={
																		template.name
																	}
																>
																	{
																		template.name
																	}
																</option>
															),
														)}
														<option value="custom">
															New template
														</option>
													</Select>
												)}
											</Mutation>
										</div>
										<Button
											onClick={() => {
												this.props.history.push(
													'/app/quotes',
												);
											}}
										>
											Save draft
										</Button>
									</div>
									<div>
										<Button>Add an attachment</Button>
										<p>Portfolio.pdf</p>
									</div>
								</SideActions>
								<CenterContent flexGrow="2">
									<FlexRow justifyContent="space-between">
										<div>
											<ToggleButton
												active={
													this.state.mode
													=== 'proposal'
												}
												onClick={(raw) => {
													this.setState({
														mode: 'proposal',
													});
												}}
											>
												Proposal
											</ToggleButton>
											<ToggleButton
												active={
													this.state.mode === 'quote'
												}
												onClick={(raw) => {
													this.setState({
														mode: 'quote',
													});
												}}
											>
												Quote
											</ToggleButton>
										</div>
										<Button>Add option</Button>
									</FlexRow>
									<FlexColumn fullHeight>
										{this.state.mode === 'quote' ? (
											<QuoteSections>
												{option.sections.map(
													(section, index) => (
														<QuoteSection
															key={`section${
																section.id
															}`}
															data={section}
															addItem={
																this.addItem
															}
															editItem={
																this.editItem
															}
															editSectionTitle={
																this
																	.editSectionTitle
															}
															removeItem={
																this.removeItem
															}
															removeSection={
																this
																	.removeSection
															}
															sectionIndex={index}
														/>
													),
												)}
												<Mutation
													mutation={ADD_SECTION}
												>
													{addSection => (
														<Button
															onClick={() => {
																this.addSection(
																	option.id,
																	addSection,
																);
															}}
														>
															Add section
														</Button>
													)}
												</Mutation>
											</QuoteSections>
										) : (
											<Mutation mutation={UPDATE_OPTION}>
												{updateOption => (
													<TextEditor
														currentContent={
															option.proposal
														}
														onChange={(raw) => {
															this.updateOption(
																option.id,
																raw,
																updateOption,
															);
														}}
													/>
												)}
											</Mutation>
										)}
									</FlexColumn>
								</CenterContent>
								<SideActions>
									<ClientAddress>
										<H5>Michel Renard</H5>
										<P>666 rue yorkshire</P>
										<P>69003 Lyon</P>
										<P>France</P>
									</ClientAddress>
									<Select>
										{quote.options.map(option => (
											<option
												value={option.name}
												key={`option${option.name}`}
											>
												{option.name}
											</option>
										))}
									</Select>
									{this.getQuoteTotal(option)}
								</SideActions>
							</FlexRow>
						</EditQuoteMain>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(EditQuote);
