import React, { Component } from 'react';
import styled from 'react-emotion';
import { withRouter } from "react-router-dom";
import { H1 } from '../../../utils/content';

import SearchQuoteForm from '../../../components/SearchQuoteForm';
import QuoteList from '../../../components/QuoteList';

const ListQuotesMain = styled('div')`
`;

const CreateNewQuoteButton = styled('button')``;

const ListQuotesTopBar = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

export const quoteState = {
  DRAFT: 0,
  SENT: 1,
  VALIDATED: 2,
  REJECTED: 3,
  INVOICE_SENT: 4,
  INVOICE_ACCEPTED: 5,
};

const temporaryStaticQuoteList = [
  {
    client: "Keiran Lee",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.DRAFT,
  },
  {
    client: "Danny D",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.DRAFT,
  },
  {
    client: "Seth Gamble",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.DRAFT,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.SENT,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.SENT,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.SENT,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.SENT,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.VALIDATED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.VALIDATED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.REJECTED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.INVOICE_ACCEPTED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.INVOICE_ACCEPTED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.INVOICE_ACCEPTED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.INVOICE_ACCEPTED,
  },
  {
    client: "Charles Dera",
    itemsLength: 5,
    dateOfIssue: new Date(2018, 6, 10),
    amount: 1450.00,
    quoteState: quoteState.INVOICE_ACCEPTED,
  },
];

class ListQuotes extends Component {
    createNewQuote = () => {
        this.props.history.push('/app/quote/create');
    }
  render() {
    return (
        <ListQuotesMain>
            <ListQuotesTopBar>
                <H1>Your quotes</H1>
                <CreateNewQuoteButton onClick={this.createNewQuote}>Create a new quote</CreateNewQuoteButton>
            </ListQuotesTopBar>
            <SearchQuoteForm/>
            <QuoteList quotes={temporaryStaticQuoteList}/>
        </ListQuotesMain>
    );
  }
}

export default withRouter(ListQuotes);
