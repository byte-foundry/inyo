import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';

import QuoteCard from '../QuoteCard';
import {
	P, primaryNavyBlue, primaryBlue, gray20,
} from '../../utils/content';

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
	border: 1px solid ${gray20};
	margin-bottom: 10px;
	border-radius: 4px;
`;
const QuoteStateQuantity = styled('label')`
	font-size: 13px;
	color: ${primaryNavyBlue};
	margin: 0;
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
	ACCEPTED: 'Acceptés',
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

		const quoteColumn = quotes.map(quote => <QuoteCard quote={quote} />);

		const quoteTotal = quotes.reduce((sum, e) => sum + e.total, 0);

		return (
			<QuoteStateListMain>
				<QuoteStateTitle>
					<QuoteStateName>
						{quoteStateName[quoteState]}
					</QuoteStateName>
					<QuoteStateAmount>{quotes.length}</QuoteStateAmount>
					<QuoteStateTotal>
						{quoteTotal.toLocaleString('fr-FR')}€ H.T.
					</QuoteStateTotal>
				</QuoteStateTitle>
				{quoteColumn}
			</QuoteStateListMain>
		);
	}
}

export default QuoteStateList;
