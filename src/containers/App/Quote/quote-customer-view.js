import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Query} from 'react-apollo';

import {GET_QUOTE_DATA_WITH_TOKEN} from '../../../utils/queries';

import QuoteDisplay from '../../../components/QuoteDisplay';
import CommentModal from '../../../components/CommentModal';

class QuoteCustomerView extends Component {
	constructor(props) {
		super(props);
		this.state = {mode: 'proposal'};
	}

	acceptOrRejectAmendment = async (quoteId, token, acceptOrRejectAmendment) => acceptOrRejectAmendment({
		variables: {
			quoteId,
			token,
		},
		update: (cache, {data: {acceptAmendment, rejectAmendment}}) => {
			const amendment = acceptAmendment || rejectAmendment;
			const data = cache.readQuery({
				query: GET_QUOTE_DATA_WITH_TOKEN,
				variables: {
					quoteId: this.props.match.params.quoteId,
					token: this.props.match.params.customerToken,
				},
			});

			data.quote = amendment;

			try {
				cache.writeQuery({
					query: GET_QUOTE_DATA_WITH_TOKEN,
					variables: {
						quoteId: this.props.match.params.quoteId,
						token: this.props.match.params.customerToken,
					},
					data,
				});
			}
			catch (e) {
				throw new Error(e);
			}
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	acceptOrRejectQuote = async (quoteId, token, acceptOrRejectQuote) => acceptOrRejectQuote({
		variables: {
			quoteId,
			token,
		},
		update: (cache, {data: {acceptQuote, rejectQuote}}) => {
			const quote = acceptQuote || rejectQuote;

			const data = cache.readQuery({
				query: GET_QUOTE_DATA_WITH_TOKEN,
				variables: {
					quoteId: this.props.match.params.quoteId,
					token: this.props.match.params.customerToken,
				},
			});

			data.quote.status = quote.status;

			try {
				cache.writeQuery({
					query: GET_QUOTE_DATA_WITH_TOKEN,
					variables: {
						quoteId: this.props.match.params.quoteId,
						token: this.props.match.params.customerToken,
					},
					data,
				});
			}
			catch (e) {
				throw new Error(e);
			}
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	render() {
		const {quoteId, customerToken} = this.props.match.params;

		return (
			<Query
				query={GET_QUOTE_DATA_WITH_TOKEN}
				variables={{quoteId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					const {
						quote: {
							options: [option],
						},
					} = data;

					const totalItems = option.sections.reduce(
						(sumItems, section) => sumItems + section.items.length,
						0,
					);

					const totalItemsFinished = option.sections.reduce(
						(sumItems, section) => sumItems
							+ section.items.filter(
								item => item.status === 'FINISHED',
							).length,
						0,
					);

					const timePlanned = option.sections.reduce(
						(timeSectionSum, section) => timeSectionSum
							+ section.items.reduce(
								(itemSum, item) => itemSum + item.unit,
								0,
							),
						0,
					);

					return (
						<div>
							<QuoteDisplay
								quoteOption={option}
								quote={data.quote}
								totalItems={totalItems}
								totalItemsFinished={totalItemsFinished}
								timePlanned={timePlanned}
								acceptOrRejectAmendment={
									this.acceptOrRejectAmendment
								}
								acceptOrRejectQuote={this.acceptOrRejectQuote}
								mode="see"
							/>
							<Route
								path={`${
									this.props.match.path
								}/comments/:itemId`}
								component={CommentModal}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default QuoteCustomerView;
