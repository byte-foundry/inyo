import styled from '@emotion/styled';
import React from 'react';

import CustomerNameAndAddress from '../../../components/CustomerNameAndAddress';
import CustomProjectHeader from '../../../components/CustomProjectHeader';
import IssuerNameAndAddress from '../../../components/IssuerNameAndAddress';
import RichTextEditor from '../../../components/RichTextEditor';
import Tooltip from '../../../components/Tooltip';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import {LoadingLogo} from '../../../utils/content';
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
`;

const Actions = styled('div')`
	max-width: calc(960px + 10rem);
	margin: 1rem auto;
	display: flex;
	justify-content: flex-end;
	padding: 2rem;
	margin: 0 auto;
`;

const Quote = ({match}) => {
	const {data, loading, error} = useQuery(GET_QUOTE, {
		variables: {
			id: match.params.quoteId,
			token: match.params.customerToken,
		},
	});

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
				<Button>
					<fbt desc="quote screen accept button">
						Accepter le devis
					</fbt>
				</Button>
				<Button>
					<fbt desc="quote screen print button">
						Imprimer le devis
					</fbt>
				</Button>
			</Actions>

			<Content>
				<Date>
					<fbt project="inyo" desc="quote screen number">
						Devis #
					</fbt>
					#TODO XXXX
					<br />
					#TODO date {quote.project.createdAt}
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
						</div>
					</Infos>

					<Infos>
						<CustomerNameAndAddress
							customer={quote.project.customer}
						/>
					</Infos>
				</Header>

				<H1>#TODO Titre du projet</H1>
				<RichTextEditor displayMode defaultValue={quote.header} />
				<UL>
					{quote.sections.map(section => (
						<LI key={section.id}>
							<Section>
								{section.name} <Line /> {section.price}
							</Section>
							<ul>
								<li>une tâche</li>
								<li>une autre tâche</li>
								<li>une dernière tâche</li>
							</ul>
						</LI>
					))}
				</UL>
				<Total>
					<div>
						{total}{' '}
						<fbt project="inyo" desc="quote screen ht">
							H.T
						</fbt>
					</div>
					<TotalTTC>
						{/* #todo vat variable */}
						{total * 1.2}{' '}
						<fbt project="inyo" desc="quote screen ttc">
							T.T.C
						</fbt>
					</TotalTTC>
				</Total>
				<Footer>
					<RichTextEditor displayMode defaultValue={quote.footer} />
				</Footer>
			</Content>
		</Container>
	);
};

export default Quote;
