import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

const QuoteCardMain = styled('div')`
	border: solid 1px grey;
	cursor: pointer;
`;

const ClientName = styled('div')``;
const DateOfIssue = styled('div')``;
const Amount = styled('div')``;

class QuoteCard extends Component {
	render() {
		const {quote} = this.props;
		const {
			customer, issuedAt, createdAt, amount, id, status,
		} = quote;
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		return (
			<QuoteCardMain
				onClick={() => {
					this.props.history.push(
						`/app/quotes/${id}/${
							status === 'DRAFT' ? 'edit' : 'see'
						}`,
					);
				}}
			>
				<ClientName>{customer.name}</ClientName>
				<DateOfIssue>
					{issuedAt
						? new Date(issuedAt).toLocaleDateString(
							'fr-FR',
							options,
						  )
						: new Date(createdAt).toLocaleDateString(
							'fr-FR',
							options,
						  )}
				</DateOfIssue>
				<Amount>{amount || 0}</Amount>
			</QuoteCardMain>
		);
	}
}

export default withRouter(QuoteCard);
