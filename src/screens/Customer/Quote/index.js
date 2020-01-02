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
	P,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	SubHeading,
} from '../../../utils/new/design-system';
import {GET_QUOTE} from '../../../utils/queries';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
	}
`;

const CompanyLogo = styled('img')`
	max-width: 75%;
	max-height: 150px;
	margin-top: 1rem;
	display: block;
`;

const Content = styled('div')`
	max-width: 1280px;
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

	return (
		<Container>
			<CustomProjectHeader
				projectId={quote.project.id}
				customerToken={match.params.customerToken}
				noProgress
			/>

			<Content>
				<div>
					<SubHeading>
						<fbt project="inyo" desc="contractor quote screen">
							Prestataire
						</fbt>
					</SubHeading>
					{quote.project.issuer.logo && (
						<CompanyLogo
							src={quote.project.issuer.logo.url}
							alt="Company logo"
						/>
					)}
					<IssuerNameAndAddress issuer={quote.project.issuer} />
				</div>

				<div>
					<SubHeading>
						<fbt project="inyo" desc="customer quote screen">
							Client
						</fbt>
					</SubHeading>
					<CustomerNameAndAddress customer={quote.project.customer} />
				</div>

				<SubHeading>
					<fbt desc="">Client</fbt>
				</SubHeading>
				<RichTextEditor displayMode defaultValue={quote.header} />
				<ul>
					{quote.sections.map(section => (
						<li key={section.id}>
							{section.name} {section.price}
						</li>
					))}
				</ul>
				<RichTextEditor displayMode defaultValue={quote.footer} />
			</Content>
		</Container>
	);
};

export default Quote;
