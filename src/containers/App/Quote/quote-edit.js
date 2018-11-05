import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Query, Mutation} from 'react-apollo';
import {ToastContainer, toast} from 'react-toastify';
import styled from 'react-emotion';
import ReactGA from 'react-ga';
import {templates} from '../../../utils/quote-templates';
import {GET_QUOTE_DATA, GET_ALL_QUOTES} from '../../../utils/queries';
import {EDIT_ITEMS} from '../../../utils/mutations';

import QuoteDisplay from '../../../components/QuoteDisplay';

const Loading = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

class EditQuote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apolloTriggerRenderTemporaryFix: false,
		};
	}

	toast = () => {
		toast.success(
			<div>
				<p>📬 Le devis a été envoyé !</p>
				<p>Retour au menu principal.</p>
			</div>,
			{
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 3000,
				onClose: () => this.props.history.push('/app/quotes'),
			},
		);
	};

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

	sendQuote = (quoteId, sendQuote) => {
		sendQuote({
			variables: {quoteId},
			update: (cache, {data: {sendQuote}}) => {
				const data = cache.readQuery({
					query: GET_ALL_QUOTES,
				});
				const updatedQuote = data.me.company.quotes.find(
					quote => quote.id === sendQuote.id,
				);

				updatedQuote.status = sendQuote.status;
				try {
					cache.writeQuery({
						query: GET_ALL_QUOTES,
						data,
					});
					ReactGA.event({
						category: 'Quote',
						action: 'Sent quote',
					});
					this.toast();
				}
				catch (e) {
					throw new Error(e);
				}
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
					throw new Error(e);
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
					throw new Error(e);
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	editItem = (itemId, sectionId, editData, updateItem) => {
		const {
			name, description, unitPrice, unit, vatRate,
		} = editData;

		updateItem({
			variables: {
				itemId,
				name,
				description,
				unitPrice,
				unit: parseFloat(unit),
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
					throw new Error(e);
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
				const itemIndex = section.items.findIndex(
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
					throw new Error(e);
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
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					throw new Error(e);
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
					throw new Error(e);
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
					throw new Error(e);
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
			<Mutation mutation={EDIT_ITEMS}>
				{EditItems => (
					<Query query={GET_QUOTE_DATA} variables={{quoteId}}>
						{({loading, error, data}) => {
							const fetchedData = {...data};

							if (loading || !fetchedData.quote) {
								return <Loading>Chargement...</Loading>;
							}
							if (error) {return <p>Error!: ${error.toString()}</p>;}
							const {quote} = fetchedData;

							if (!this.state.selectedOption) {
								this.setState({
									selectedOption: quote.options[0].name,
								});
								this.setQuoteData(quote.template, EditItems);
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
								<div>
									<ToastContainer />
									<QuoteDisplay
										quoteTemplates={quoteTemplates}
										quoteOption={option}
										quote={quote}
										mode="edit"
										sendQuote={this.sendQuote}
										editQuoteTitle={this.editQuoteTitle}
										setQuoteData={this.setQuoteData}
										addItem={this.addItem}
										editItem={this.editItem}
										editSectionTitle={this.editSectionTitle}
										removeItem={this.removeItem}
										removeSection={this.removeSection}
										addSection={this.addSection}
										updateOption={this.updateOption}
										issuer={quote.issuer}
									/>
								</div>
							);
						}}
					</Query>
				)}
			</Mutation>
		);
	}
}

export default withRouter(EditQuote);
