import React, {Component} from 'react';
import styled from 'react-emotion';
import {withRouter} from 'react-router-dom';
import {Mutation, Query} from 'react-apollo';
import Select from 'react-select';
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
	Button,
	primaryNavyBlue,
	primaryBlue,
	gray20,
	gray10,
	gray30,
	secondaryLightBlue,
	gray50,
} from '../../../utils/content';

const EditQuoteMain = styled('div')`
	min-height: 100vh;
	max-width: 1600px;
	margin-left: auto;
	margin-right: auto;
`;

const BackButton = styled(Button)`
	padding: 10px 5px;
	font-size: 11px;
	margin-bottom: 10px;
	color: ${gray50};
`;

const EditQuoteTitle = styled(H1)`
	color: ${primaryNavyBlue};
	margin: 0;
`;

const ToggleButton = styled('span')`
	color: ${props => (props.active ? primaryBlue : gray30)};
	cursor: pointer;
	margin-right: 20px;
	padding-top: 15px;
	padding-bottom: 10px;
	border-bottom: 4px solid
		${props => (props.active ? primaryBlue : 'transparent')};
	transition: color 0.2s ease, border-color 0.2s ease;
`;
const AddOptionButton = styled('button')``;
const ClientAddress = styled('div')``;
const QuoteSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 15vw;
	padding: 20px 40px;
`;
const QuoteName = styled(H3)`
	color: ${primaryBlue};
	margin: 0;
`;
const CenterContent = styled(FlexColumn)`
	background: ${gray10};
	padding: 20px 40px;
`;

const QuoteRow = styled(FlexRow)`
	padding-left: 40px;
	padding-right: 40px;
	padding-top: 10px;
	padding-bottom: ${props => (props.noPadding ? '0px' : '10px')};
	border-bottom: 1px solid ${gray20};
`;

const QuoteContent = styled('div')`
	max-width: 750px;
	width: -webkit-fill-available;
	margin-left: auto;
	margin-right: auto;
	padding-bottom: 40px;
`;

const CompanyName = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 10px;
`;

const ContactName = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 10px;
`;

const AddressBlock = styled('div')`
	border-top: 1px solid ${primaryBlue};
	padding-top: 10px;
`;

const Address = styled(P)`
	color: ${primaryBlue};
	font-size: 11px;
	margin: 0;
	margin-bottom: 5px;
`;

const QuoteAction = styled(Button)`
	text-decoration: none;
	color: ${primaryBlue};
	font-size: 13px;
	transform: translateY(18px);
	margin-top: 10px;
	margin-bottom: 10px;
`;

const SelectStyles = {
	option: (base, state) => ({
		...base,
		borderRadius: 0,
	}),
	menu: (base, state) => ({
		...base,
		marginTop: 2,
		borderRadius: 0,
	}),
	control: base => ({
		...base,
		width: 300,
		border: 'none',
		borderRadius: 0,
	}),
	singleValue: (base, state) => ({
		...base,
	}),
};
const SendQuoteButton = styled(Button)`
	width: auto;
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

			if (typeof EditItems === 'function') {
				EditItems({variables: {items}});
			}
		}
		else if (typeof EditItems === 'function') {
			EditItems({variables: {items: []}});
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

		const quoteTemplates = templates.map(template => ({
			value: template.name,
			label: template.label,
		}));

		quoteTemplates.push({value: 'custom', label: 'Sans recommandation'});

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
							<BackButton
								theme="Link"
								size="XSmall"
								onClick={() => this.props.history.push('/app/quotes')
								}
							>
								Retour à la liste des devis
							</BackButton>
							<QuoteRow justifyContent="space-between">
								<EditQuoteTitle>
									Remplissez votre devis
								</EditQuoteTitle>
								<Mutation mutation={SEND_QUOTE}>
									{sendQuote => (
										<SendQuoteButton
											theme="Primary"
											size="Medium"
											onClick={() => {
												this.sendQuote(
													quote.id,
													sendQuote,
												);
											}}
										>
											Envoyez la proposition
										</SendQuoteButton>
									)}
								</Mutation>
							</QuoteRow>
							<QuoteRow justifyContent="space-between">
								<QuoteName>
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
								</QuoteName>
								<Mutation mutation={EDIT_ITEMS}>
									{EditItems => (
										<Select
											styles={SelectStyles}
											placeholder="Recommandation de contenu"
											onChange={(e) => {
												this.setQuoteData(
													e.value,
													EditItems,
												);
											}}
											options={quoteTemplates}
										/>
									)}
								</Mutation>
							</QuoteRow>
							<QuoteRow noPadding>
								<ToggleButton
									active={this.state.mode === 'proposal'}
									onClick={(raw) => {
										this.setState({
											mode: 'proposal',
										});
									}}
								>
									Proposition
								</ToggleButton>
								<ToggleButton
									active={this.state.mode === 'quote'}
									onClick={(raw) => {
										this.setState({
											mode: 'quote',
										});
									}}
								>
									Devis
								</ToggleButton>
							</QuoteRow>
							<FlexRow justifyContent="space-between">
								<CenterContent flexGrow="2">
									<QuoteContent>
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
																	this
																		.editItem
																}
																editSectionTitle={
																	this
																		.editSectionTitle
																}
																removeItem={
																	this
																		.removeItem
																}
																removeSection={
																	this
																		.removeSection
																}
																sectionIndex={
																	index
																}
															/>
														),
													)}
													<Mutation
														mutation={ADD_SECTION}
													>
														{addSection => (
															<QuoteAction
																theme="Link"
																size="XSmall"
																onClick={() => {
																	this.addSection(
																		option.id,
																		addSection,
																	);
																}}
															>
																Ajouter une
																section
															</QuoteAction>
														)}
													</Mutation>
												</QuoteSections>
											) : (
												<Mutation
													mutation={UPDATE_OPTION}
												>
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
									</QuoteContent>
								</CenterContent>
								<SideActions>
									<ClientAddress>
										<CompanyName>{quote.customer.name}</CompanyName>
										<ContactName>{quote.customer.firstName} {quote.customer.lastName}</ContactName>
										<AddressBlock>
											<Address>{quote.customer.address.street}</Address>
											<Address>{quote.customer.address.postalCode}{' '}
											{quote.customer.address.city}</Address>
											<Address>{quote.customer.address.country}</Address>
										</AddressBlock>
									</ClientAddress>
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
