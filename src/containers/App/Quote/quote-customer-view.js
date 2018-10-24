import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Query} from 'react-apollo';

import {GET_QUOTE_DATA_WITH_TOKEN} from '../../../utils/queries';

import QuoteDisplay from '../../../components/QuoteDisplay';
import CommentModal from '../../../components/CommentModal';

class QuoteCustomerView extends Component {
	constructor(props) {
		super(props);
		this.state = {mode: 'proposal'};
	}

	render() {
		const {quoteId, customerToken} = this.props.match.params;

		return (
			<Query
				query={GET_QUOTE_DATA_WITH_TOKEN}
				variables={{quoteId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

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

					return (
						<div>
							<QuoteDisplay
								quoteOption={option}
								quote={data.quote}
								totalItems={totalItems}
								totalItemsFinished={totalItemsFinished}
								timePlanned={timePlanned}
								mode="see"
							/>
							<Route
								path={`${
									this.props.match.path
								}/comments/:itemId`}
								component={CommentModal}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default QuoteCustomerView;
