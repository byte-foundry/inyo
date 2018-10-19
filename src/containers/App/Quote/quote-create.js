import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {Redirect} from 'react-router-dom';

import CreateQuoteForm from './create-quote-form';
import {GET_USER_CUSTOMERS} from '../../../utils/queries';

const CreateQuoteMain = styled('div')``;

class CreateQuote extends Component {
	render() {
		const {history} = this.props;

		return (
			<Query query={GET_USER_CUSTOMERS}>
				{({loading, error, data}) => {
					if (loading) return <p>Loading...</p>;
					if (data && data.me) {
						const {customers} = data.me.company;

						console.log(data);
						return (
							<CreateQuoteMain>
								<CreateQuoteForm
									customers={customers}
									onCreate={(newQuote) => {
										history.push(
											`/app/quotes/${newQuote.id}/edit`,
										);
									}}
								/>
							</CreateQuoteMain>
						);
					}

					return <Redirect to="/app/auth" />;
				}}
			</Query>
		);
	}
}

export default CreateQuote;
