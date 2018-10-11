import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';

import QuoteCard from '../QuoteCard';
import {quoteState} from '../../containers/App/Dashboard';

const QuoteStateListMain = styled('div')`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const QuoteStateTitle = styled('label')`
	display: flex;
	flex-flow: row nowrap;
	font-size: 1.2em;
`;
const QuoteStateAmount = styled('label')`
	font-size: 0.6em;
`;
const QuoteStateName = styled('label')``;

const quoteStateName = {
	DRAFT: 'Draft',
	SENT: 'Sent',
	VALIDATED: 'Accepted',
	REJECTED: 'Rejected',
	INVOICE_SENT: 'Invoice sent',
	INVOICE_ACCEPTED: 'Invoice accepted',
};

class QuoteStateList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {quotes, quoteState} = this.props;

		const totalAmount = quotes.reduce((acc, quote) => acc + quote.amount, 0);

		const quoteColumn = quotes.map(quote => <QuoteCard quote={quote} />);

		return (
			<QuoteStateListMain>
				<QuoteStateTitle>
					<QuoteStateName>{quoteStateName[quoteState]}</QuoteStateName>
					<QuoteStateAmount>{totalAmount}</QuoteStateAmount>
				</QuoteStateTitle>
				{quoteColumn}
			</QuoteStateListMain>
		);
	}
}

export default QuoteStateList;
