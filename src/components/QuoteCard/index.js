import React, {Component} from 'react';
import styled from 'react-emotion';

const QuoteCardMain = styled('div')`
	border: solid 1px grey;
`;

const ClientName = styled('div')``;
const DateOfIssue = styled('div')``;
const Amount = styled('div')``;

class QuoteCard extends Component {
	render() {
		const {quote} = this.props;
		const {client, dateOfIssue, amount} = quote;

		return (
			<QuoteCardMain>
				<ClientName>{client}</ClientName>
				<DateOfIssue>{dateOfIssue.toLocaleString()}</DateOfIssue>
				<Amount>{amount}</Amount>
			</QuoteCardMain>
		);
	}
}

export default QuoteCard;
