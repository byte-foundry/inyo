import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';
import {
	P,
	primaryNavyBlue,
	gray50,
	secondaryLightBlue,
} from '../../utils/content';

const QuoteCardMain = styled('div')`
	border: solid 1px grey;
	cursor: pointer;
	margin-right: 10px;
	margin-bottom: 10px;
`;

const CardHeader = styled('div')`
	background: ${secondaryLightBlue};
	padding: 8px 16px 15px 16px;
`;

const ClientName = styled(P)`
	margin: 0;
	color: ${primaryNavyBlue};
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
			customer,
			issuedAt,
			createdAt,
			id,
			status,
			options: [{sections}],
		} = quote;
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		const amount = sections.reduce(
			(acc, section) => acc
				+ section.items.reduce(
					(itemSum, item) => itemSum + item.unitPrice,
					0,
				),
			0,
		);

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
