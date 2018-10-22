import React, {Component} from 'react';
import styled from 'react-emotion';

import {
	H4, H6, gray20, primaryNavyBlue,
} from '../../utils/content';

const TotalMain = styled('div')`
	margin-top: 10px;
`;
const TotalElem = styled('div')`
	padding-top: 15px;
	padding-bottom: 15px;
	border-top: 1px solid ${gray20};
	border-bottom: 1px solid ${gray20};
`;
const TotalLabel = styled(H6)`
	font-size: 13px;
	margin: 0;
`;
const TotalNumber = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 5px;
`;

class QuoteTotal extends Component {
	render() {
		const {sumDays, sumHT, sumTTC} = this.props;

		return (
			<TotalMain>
				<TotalElem>
					<TotalNumber>{sumDays} days</TotalNumber>
					<TotalLabel>Temps prévu</TotalLabel>
				</TotalElem>
				<TotalElem>
					<TotalNumber>{sumHT} €</TotalNumber>
					<TotalLabel>Total H.T.</TotalLabel>
				</TotalElem>
				<TotalElem>
					<TotalNumber>{sumTTC} €</TotalNumber>
					<TotalLabel>Total T.T.C</TotalLabel>
				</TotalElem>
			</TotalMain>
		);
	}
}

export default QuoteTotal;
