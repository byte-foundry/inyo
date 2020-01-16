import '../../../print.css';

import styled from '@emotion/styled';
import moment from 'moment';
import React, {useContext} from 'react';

import CustomerNameAndAddress from '../../../components/CustomerNameAndAddress';
import CustomProjectHeader from '../../../components/CustomProjectHeader';
import IssuerNameAndAddress from '../../../components/IssuerNameAndAddress';
import RichTextEditor from '../../../components/RichTextEditor';
import Tooltip from '../../../components/Tooltip';
import fbt from '../../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import {LoadingLogo} from '../../../utils/content';
import {CustomerContext} from '../../../utils/contexts';
import {ACCEPT_QUOTE} from '../../../utils/mutations';
import {
	accentGrey,
	Button,
	Heading,
	P,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	SubHeading,
} from '../../../utils/new/design-system';
import {GET_PROJECT_QUOTES, GET_QUOTE} from '../../../utils/queries';
import useUserInfos from '../../../utils/useUserInfos';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
	}
`;

const CompanyLogo = styled('img')`
	max-width: 150px;
	max-height: 150px;
	margin-top: 1rem;
	display: block;
`;

const Header = styled('div')`
	display: flex;
	flex-direction: row;
	margin-bottom: 5rem;
	align-items: flex-end;
`;

const Date = styled('div')`
	text-align: right;
	margin-bottom: 5rem;
`;

const Infos = styled('div')`
	flex: 1 0 50%;
`;

const H1 = styled(Heading)`
	margin-bottom: 2rem;
`;

const UL = styled('ul')`
	padding-left: 25%;
	margin: 5rem auto 0;
`;

const LI = styled('li')`
	display: flex;
	flex-direction: column;

	ul {
		margin-bottom: 1rem;
	}
`;

const Total = styled('div')`
	border-top: 2px solid ${primaryBlack};
	margin-top: 1rem;
	padding-top: 1rem;
	font-size: 1.4rem;
	font-weight: 500;
	text-align: right;
	margin-left: 25%;
`;

const Footer = styled('div')`
	margin: 2rem 0;
	margin-left: 25%;
`;

const TotalTTC = styled('div')`
	font-size: 1.1rem;
	color: ${accentGrey};
`;

const Section = styled('div')`
	display: flex;
	align-items: center;
	margin: 10px 0;
`;

const Line = styled('div')`
	flex: 1 1 10px;
	border-bottom: 1px dotted lightgrey;
	margin: 0 20px;
	height: 1px;
	font-weight: 500;
`;

const Content = styled('div')`
	max-width: 960px;
	min-height: 1370px;
	margin: 0 auto;
	border: 1px solid lightgrey;
	box-shadow: 15px 15px 15px lightgrey;
	padding: 4rem 5rem;

	@media print {
		box-shadow: none;
		border: none;
		padding: 0;
		width: 100%;
		max-width: auto;
		min-height: auto;
	}
`;

const Actions = styled('div')`
	max-width: calc(960px + 10rem);
	display: flex;
	justify-content: flex-end;
	padding: 2rem;
	margin: 0 auto;

	@media print {
		display: none;
	}
`;

const Quote = ({match}) => {
	const customerToken = useContext(CustomerContext);
	const {data, loading, error} = useQuery(GET_QUOTE, {
		variables: {
			id: match.params.quoteId,
			token: match.params.customerToken,
		},
	});

	const [acceptQuote] = useMutation(ACCEPT_QUOTE);

	if (loading) return <LoadingLogo />;
	if (error) throw error;

	const {quote} = data;

	const total = quote.sections.reduce(
		(total, section) => total + section.price,
		0,
	);

	return (
		<Container>
			<CustomProjectHeader
				projectId={quote.project.id}
				customerToken={match.params.customerToken}
				noProgress
			/>
			<Actions>
				{quote.acceptedAt ? (
					<div>Accepté le {moment(quote.acceptedAt).format('L')}</div>
				) : (
					<Button
						onClick={() => {
							acceptQuote({
								variables: {
									id: quote.id,
									token: customerToken,
								},
							});
						}}
					>
						<fbt desc="quote screen accept button">
							Accepter le devis
						</fbt>
					</Button>
				)}
				<Button>
					<fbt desc="quote screen print button">
						Imprimer le devis
					</fbt>
				</Button>
			</Actions>

			<Content>
				<Date>
					<fbt project="inyo" desc="quote screen number">
						Devis #<fbt:param name="issue number">
							{quote.issueNumber}
						</fbt:param>
					</fbt>
					<br />
					{moment(quote.createdAt).format('L')}
				</Date>
				<Header>
					<Infos>
						<div>
							{quote.project.issuer.logo && (
								<CompanyLogo
									src={quote.project.issuer.logo.url}
									alt="Company logo"
								/>
							)}
							<IssuerNameAndAddress
								issuer={quote.project.issuer}
							/>
							{quote.project.issuer.vat && (
								<div>N° TVA: {quote.project.issuer.vat}</div>
							)}
							{quote.project.issuer.siret && (
								<div>SIRET: {quote.project.issuer.siret}</div>
							)}
							{quote.project.issuer.rcs && (
								<div>RCS: {quote.project.issuer.rcs}</div>
							)}
						</div>
					</Infos>

					<Infos>
						<CustomerNameAndAddress
							customer={quote.project.customer}
						/>
					</Infos>
				</Header>

				<H1>{quote.project.name}</H1>
				<RichTextEditor displayMode defaultValue={quote.header} />
				<UL>
					{quote.sections.map(section => (
						<li key={section.id} style={{pageBreakInside: 'avoid'}}>
							<Section>
								{section.name} <Line />{' '}
								<fbt desc="section price">
									<fbt:param name="price">
										{section.price.toFixed(2)}
									</fbt:param>{' '}
									€
								</fbt>
							</Section>
							<ul>
								{section.items.map(item => (
									<li>{item.name}</li>
								))}
							</ul>
						</li>
					))}
				</UL>
				<Total>
					{quote.hasTaxes ? (
						<>
							<div>
								<fbt project="inyo" desc="quote screen ht">
									Total HT{' '}
									<fbt:param name="subtotal">
										{total.toFixed(2)}
									</fbt:param>{' '}
									€
								</fbt>
							</div>
							<TotalTTC>
								<fbt project="inyo" desc="quote screen taxes">
									TVA{' '}
									<fbt:param name="value">
										{quote.taxRate}
									</fbt:param>
									% soit{' '}
									<fbt:param name="total">
										{Math.abs(
											total
												- total
													* (1 + quote.taxRate / 100),
										).toFixed(2)}
									</fbt:param>{' '}
									€
								</fbt>
							</TotalTTC>
							<TotalTTC>
								<fbt project="inyo" desc="quote screen ttc">
									Total TTC
									<fbt:param name="total">
										{(
											total
											* (1 + quote.taxRate / 100)
										).toFixed(2)}
									</fbt:param>{' '}
									€
								</fbt>
							</TotalTTC>
						</>
					) : (
						<TotalTTC>
							<fbt project="inyo" desc="quote screen ttc">
								Total HT{' '}
								<fbt:param name="subtotal">
									{total.toFixed(2)}
								</fbt:param>{' '}
								€
							</fbt>
						</TotalTTC>
					)}
				</Total>
				<Footer>
					<RichTextEditor displayMode defaultValue={quote.footer} />
				</Footer>
			</Content>
		</Container>
	);
};

export default Quote;
