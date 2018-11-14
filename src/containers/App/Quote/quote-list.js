import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {GET_ALL_QUOTES} from '../../../utils/queries';
import {
	H1,
	Button,
	primaryNavyBlue,
	primaryWhite,
	Loading,
} from '../../../utils/content';

import {ReactComponent as AccountIcon} from '../../../utils/icons/user.svg';

import SearchQuoteForm from '../../../components/SearchQuoteForm';
import QuoteList from '../../../components/QuoteList';

const ListQuotesMain = styled('div')`
	background-color: #fbfbfb;
	min-height: 100vh;
`;

const TopBarButton = styled(Button)`
	height: 60px;
	padding: 0 25px;
	svg {
		width: 60px;
	}
`;

const ListQuotesTopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	padding-left: 40px;
	padding-right: 40px;
	background-color: ${primaryWhite};
`;

const TopBarTitle = styled(H1)`
	color: ${primaryNavyBlue};
`;

const ActionRow = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

export const quoteState = {
	DRAFT: 0,
	SENT: 1,
	ACCEPTED: 2,
};

class ListQuotes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quotes: undefined,
		};
	}

	createNewQuote = () => {
		this.props.history.push('/app/quotes/create');
	};

	render() {
		const {quotes, baseQuotes} = this.state;

		return (
			<Query query={GET_ALL_QUOTES}>
				{({loading, error, data}) => {
					if (loading) return <Loading />;
					if (error) {
						throw new Error(error);
						return <span />;
					}
					if (!quotes) {
						this.setState({
							quotes: data.me.company.quotes,
							baseQuotes: data.me.company.quotes,
						});
					}

					return (
						<ListQuotesMain>
							<ListQuotesTopBar>
								<TopBarTitle>Vos projets</TopBarTitle>
								<ActionRow>
									<TopBarButton
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.history.push(
												'/app/account',
											);
										}}
									>
										<AccountIcon />
									</TopBarButton>
									<TopBarButton
										theme="Primary"
										size="Medium"
										onClick={this.createNewQuote}
									>
										Créer un nouveau projet
									</TopBarButton>
								</ActionRow>
							</ListQuotesTopBar>
							{quotes && (
								<div>
									<SearchQuoteForm
										baseQuotes={baseQuotes}
										sortByCustomer={(value) => {
											this.setState({
												quotes:
													value !== 'all'
														? baseQuotes.filter(
															e => e.customer
																.name
																	=== value,
														  )
														: baseQuotes,
											});
										}}
										sortByDate={(from, to) => {
											this.setState({
												quotes: baseQuotes.filter(
													quote => (quote.issuedAt
														? new Date(
															quote.issuedAt,
															  )
														: new Date(
															quote.createdAt,
															  )) >= from
														&& (quote.issuedAt
															? new Date(
																quote.issuedAt,
															  )
															: new Date(
																quote.createdAt,
															  )) <= to,
												),
											});
										}}
									/>
									<QuoteList quotes={quotes} />
								</div>
							)}
						</ListQuotesMain>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(ListQuotes);
