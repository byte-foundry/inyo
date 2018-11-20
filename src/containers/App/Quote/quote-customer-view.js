import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Query} from 'react-apollo';
import {ToastContainer, toast} from 'react-toastify';
import styled from 'react-emotion';
import {GET_QUOTE_DATA_WITH_TOKEN} from '../../../utils/queries';
import {Loading} from '../../../utils/content';

import QuoteDisplay from '../../../components/QuoteDisplay';

class QuoteCustomerView extends Component {
	constructor(props) {
		super(props);
		this.state = {mode: 'proposal', isCrispLoggedIn: false};
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
			toast.info(
				<div>
					<p>📬 Le prestataire a été notifié.</p>
				</div>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				},
			);
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
			toast.info(
				<div>
					<p>📬 Le prestataire a été notifié.</p>
				</div>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				},
			);
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
				{({
					loading, error, data, refetch,
				}) => {
					if (loading) return <Loading />;
					if (error) {
						throw new Error(error);
						return <span />;
					}
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

					if (!this.state.isCrispLoggedIn && data.quote.customer) {
						window.$crisp.push([
							'set',
							'user:email',
							[data.quote.customer.email],
						]);
						window.$crisp.push([
							'set',
							'user:nickname',
							[
								`${data.quote.customer.firstName} ${
									data.quote.customer.lastName
								} (${data.quote.customer.name})`,
							],
						]);
						window.$crisp.push([
							'set',
							'session:segments',
							[['customer']],
						]);
					}

					return (
						<div>
							<ToastContainer />
							<QuoteDisplay
								quoteOption={option}
								issuer={data.quote.issuer}
								quote={data.quote}
								totalItems={totalItems}
								totalItemsFinished={totalItemsFinished}
								timePlanned={timePlanned}
								refetch={refetch}
								acceptOrRejectAmendment={
									this.acceptOrRejectAmendment
								}
								acceptOrRejectQuote={this.acceptOrRejectQuote}
								mode="see"
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default QuoteCustomerView;
