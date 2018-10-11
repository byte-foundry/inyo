import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import {H3} from '../../../utils/content';
import {GET_USER_CUSTOMERS} from '../../../utils/queries';

const CreateQuoteMain = styled('div')``;

class CreateQuote extends Component {
	render() {
		return (
			<Query query={GET_USER_CUSTOMERS}>
				{({
					client, loading, error, data,
				}) => {
					if (loading) return <p>Loading...</p>;
					if (data && data.me) {
						const {me} = data;
						const {company} = me;
						const {customers} = company;

						if (!customers.length) {
							return <Redirect to="/app/customer/create" />;
						}

						return (
							<CreateQuoteMain>
								<H3>Create your quote</H3>
								<input type="text" placeholder="Customer" />
								<button>Create quote</button>
							</CreateQuoteMain>
						);
					}
					return <div />;
				}}
			</Query>
		);
	}
}

export default CreateQuote;
