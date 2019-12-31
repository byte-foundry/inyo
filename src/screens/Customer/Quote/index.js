import styled from '@emotion/styled';
import React from 'react';

import RichTextEditor from '../../../components/RichTextEditor';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {LoadingLogo} from '../../../utils/content';
import {GET_QUOTE} from '../../../utils/queries';

const Container = styled('div')``;

const Quote = ({match}) => {
	const {data, loading} = useQuery(GET_QUOTE, {
		variables: {
			id: match.params.quoteId,
		},
	});

	if (loading) return <LoadingLogo />;
	if (!data) throw new Error('Not found');

	const {quote} = data;

	return (
		<Container>
			<RichTextEditor displayMode defaultValue={quote.header} />
			<ul>
				{quote.sections.map(section => (
					<li key={section.id}>
						{section.name} {section.price}
					</li>
				))}
			</ul>
			<RichTextEditor displayMode defaultValue={quote.footer} />
		</Container>
	);
};

export default Quote;
