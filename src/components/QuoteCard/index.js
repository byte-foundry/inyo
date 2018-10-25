import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import {
	P,
	alpha10,
	primaryNavyBlue,
	gray50,
	secondaryLightBlue,
	primaryBlue,
} from '../../utils/content';

const QuoteCardMain = styled('div')`
	border: solid 1px ${alpha10};
	cursor: pointer;
	margin-right: 10px;
	margin-bottom: 10px;
`;

const CardHeader = styled('div')`
	background: ${secondaryLightBlue};
	padding: 8px 16px 15px 16px;
`;

const QuoteName = styled(P)`
	margin: 0;
	color: ${primaryNavyBlue};
`;
const ClientName = styled(P)`
	margin: 0;
	color: ${primaryBlue};
	font-size: 80%;
`;
const DateOfIssue = styled('span')`
	color: ${gray50};
	font-size: 13px;
`;
const Amount = styled('div')`
	padding: 8px 16px 15px 16px;
	font-size: 24px;
	color: ${primaryNavyBlue};
	text-align: right;
`;

class QuoteCard extends Component {
	render() {
		const {quote} = this.props;
		const {
			customer, issuedAt, createdAt, id, status, total,
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
				<CardHeader>
					<QuoteName>{quote.name}</QuoteName>
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
				</CardHeader>
				<Amount>{total || 0} HT</Amount>
			</QuoteCardMain>
		);
	}
}

export default withRouter(QuoteCard);
