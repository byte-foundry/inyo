import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {endOfDay} from 'date-fns';
import {GET_ALL_QUOTES} from '../../../utils/queries';
import {H1, Button, primaryNavyBlue} from '../../../utils/content';

import AccountLogo from './accountLogo.svg';

import SearchQuoteForm from '../../../components/SearchQuoteForm';
import QuoteList from '../../../components/QuoteList';

const ListQuotesMain = styled('div')`
	max-width: 1600px;
	margin-left: auto;
	margin-right: auto;
`;

const TopBarButton = styled(Button)`
	height: 60px;
	margin-left: 20px;
`;

const ListQuotesTopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40px;
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

const TopBarAccountIcon = styled('img')`
	height: 60px;
	width: auto;
`;

const Loading = styled('div')`
	font-size: 70px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

export const quoteState = {
	DRAFT: 0,
	SENT: 1,
	ACCEPTED: 2,
	REJECTED: 3,
	INVOICE_SENT: 4,
	INVOICE_ACCEPTED: 5,
};

class ListQuotes extends Component {
	createNewQuote = () => {
		this.props.history.push('/app/quotes/create');
	};

	render() {
		return (
			<Query query={GET_ALL_QUOTES}>
				{({loading, error, data}) => {
					console.log(data);
					if (loading) return <Loading>Chargement...</Loading>;
					if (error) return <p>Error!: ${error.toString()}</p>;
					const {quotes} = data.me.company;

					return (
						<ListQuotesMain>
							<ListQuotesTopBar>
								<TopBarTitle>Vos devis</TopBarTitle>
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
										<TopBarAccountIcon
											src={AccountLogo}
											alt="account logo"
										/>
									</TopBarButton>
									<TopBarButton
										theme="Primary"
										size="Medium"
										onClick={this.createNewQuote}
									>
										Créer un nouveau devis
									</TopBarButton>
								</ActionRow>
							</ListQuotesTopBar>
							<SearchQuoteForm />
							<QuoteList quotes={quotes} />
						</ListQuotesMain>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(ListQuotes);
