import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';

import QuoteCard from '../QuoteCard';
import {P, primaryNavyBlue, primaryBlue} from '../../utils/content';

const QuoteStateListMain = styled('div')`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const QuoteStateTitle = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin-right: 10px;
	padding: 14px 16px 15px 16px;
	border: 1px solid ${primaryNavyBlue};
	margin-bottom: 10px;
`;
const QuoteStateAmount = styled(P)`
	font-size: 13px;
	color: ${primaryNavyBlue};
	margin: 0;
`;
const QuoteStateName = styled(P)`
	font-size: 13px;
	color: ${primaryNavyBlue};
	font-weight: bold;
	margin: 0;
`;
const QuoteStateTotal = styled(P)`
	font-size: 13px;
	color: ${primaryBlue};
	margin: 0;
`;

const quoteStateName = {
	DRAFT: 'Brouillons',
	SENT: 'Envoyés',
	VALIDATED: 'Acceptés',
	REJECTED: 'Rejetées',
	INVOICE_SENT: 'Facture envoyée',
	INVOICE_ACCEPTED: 'Facture acceptée',
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

		console.log(quotes);

		const quoteColumn = quotes.map(quote => <QuoteCard quote={quote} />);

		return (
			<QuoteStateListMain>
				<QuoteStateTitle>
					<QuoteStateName>
						{quoteStateName[quoteState]}
					</QuoteStateName>
					<QuoteStateAmount>{quotes.length}</QuoteStateAmount>
					<QuoteStateTotal>{quotes.length} HT</QuoteStateTotal>
				</QuoteStateTitle>
				{quoteColumn}
			</QuoteStateListMain>
		);
	}
}

export default QuoteStateList;
