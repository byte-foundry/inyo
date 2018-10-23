import React, {Component} from 'react';
import styled from 'react-emotion';
import {Switch, Route, Link} from 'react-router-dom';
import QuoteSee from './quote-see';
import QuoteCustomerView from './quote-customer-view';
import QuoteEdit from './quote-edit';
import QuoteCreate from './quote-create';
import QuoteList from './quote-list';
import {H1} from '../../../utils/content';

const QuoteMain = styled('div')``;

class Quote extends Component {
	render() {
		return (
			<QuoteMain>
				<Switch>
					<Route exact path="/app/quotes" component={QuoteList} />
					<Route
						path="/app/quotes/:quoteId/see"
						component={QuoteSee}
					/>
					<Route
						path="/app/quotes/:quoteId/edit/"
						component={QuoteEdit}
					/>
					<Route path="/app/quotes/create" component={QuoteCreate} />
				</Switch>
			</QuoteMain>
		);
	}
}

export default Quote;
