import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled, {keyframes} from 'react-emotion';

import {
	P,
	alpha10,
	primaryNavyBlue,
	gray50,
	secondaryLightBlue,
	primaryBlue,
	primaryWhite,
} from '../../utils/content';

import {ReactComponent as eyeIcon} from '../../utils/icons/eye.svg';

const QuoteCardMain = styled('div')`
	position: relative;
	background-color: ${primaryWhite};
	box-shadow: 0px 0px 8px ${alpha10};
	cursor: pointer;
	margin-right: 10px;
	margin-bottom: 10px;
	border-radius: 3px;

	&:hover {
		box-shadow: 0px 0px 25px ${alpha10};
	}
`;

const CardHeader = styled('div')`
	border-bottom: 1px solid ${secondaryLightBlue};
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

const pulsePB = keyframes`
  0% {
	stroke: "#dfe1e6";
  }
  50% {
    stroke: ${primaryBlue};
  }
  100% {
    stroke: "#dfe1e6";
  }
`;

const pulsePNB = keyframes`
  0% {
	stroke: "#b0b0b5";
  }
  50% {
    stroke: ${primaryNavyBlue};
  }
  100% {
    stroke: "#b0b0b5";
  }
`;

const pulsePNBF = keyframes`
  0% {
	fill: "#b0b0b5";
  }
  50% {
    fill: ${primaryNavyBlue};
  }
  100% {
    fill: "#b0b0b5";
  }
`;

const EyeIcon = styled(eyeIcon)`
	position: absolute;
	left: 16px;
	bottom: 20px;
	width: 30px;
	height: auto;
	opacity: ${props => (props.viewedByCustomer ? '1' : '0.2')};
	.cls-1 {
		stroke: ${primaryBlue};
	}
	.cls-2,
	.cls-3 {
		stroke: ${primaryNavyBlue};
	}
	.cls-4 {
		fill: ${primaryNavyBlue};
	}
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
					<ClientName>{customer.name}</ClientName>
					<QuoteName>{quote.name}</QuoteName>
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
				<Amount>{total || 0}€ H.T.</Amount>
				{status === 'SENT' && (
					<EyeIcon viewedByCustomer={quote.viewedByCustomer} />
				)}
			</QuoteCardMain>
		);
	}
}

export default withRouter(QuoteCard);
