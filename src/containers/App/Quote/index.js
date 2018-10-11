import React, { Component } from 'react';
import styled from 'react-emotion';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import QuoteSee from './quote-see';
import QuoteEdit from './quote-edit';
import QuoteCreate from './quote-create';
import QuoteList from './quote-list';
import { H1 } from '../../../utils/content';

const QuoteMain = styled('div')`
`;

class Quote extends Component {
    createNewQuote = () => {
        this.props.history.push('/app/quote/create');
    }
  render() {
    return (
        <Router>
            <QuoteMain>
                <Route exact path="/app/quote" component={QuoteList} />
                <Route path="/app/quote/see" component={QuoteSee} />
                <Route path="/app/quote/edit" component={QuoteEdit} />
                <Route path="/app/quote/create" component={QuoteCreate} />
            </QuoteMain>
        </Router>
    );
  }
}

export default Quote;
