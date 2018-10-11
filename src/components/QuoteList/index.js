import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';

import QuoteStateList from '../QuoteStateList';
import {quoteState} from '../../containers/App/Quote/quote-list';

const QuoteListMain = styled('div')`
	display: flex;
	flex-flow: row nowrap;
`;

class QuoteList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {shouldRedirect} = this.state;
		const {quotes, from} = this.props;

		if (shouldRedirect) {
			return <Redirect to={from} />;
		}

		const quoteColumn = Object.entries(quoteState).map(([state, value]) => {
			const filteredQuotes = quotes.filter(quote => quote.quoteState === value);

			return <QuoteStateList quotes={filteredQuotes} quoteState={state} />;
		});

		return <QuoteListMain>{quoteColumn}</QuoteListMain>;
	}
}

export default QuoteList;
