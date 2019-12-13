import styled from '@emotion/styled';
import React from 'react';

import {LABEL_EMAIL_PARAM} from '../../utils/constants';
import {FlexRow} from '../../utils/content';
import {
	lightGrey,
	mediumGrey,
	primaryBlack
} from '../../utils/new/design-system';

const Param = styled('div')`
	margin: 0 0 0.5rem 0.5rem;
	background: ${props =>
		props.used ? 'rgba(34, 201, 121, 0.3)' : lightGrey};
	color: ${props => (props.used ? '#22C979' : '#505050')};
	border-radius: 20px;
	padding: 8px 18px;
	font-size: 12px;

	&:hover {
		background: ${props =>
			props.used ? 'rgba(34, 201, 121, 0.5);' : mediumGrey};
		color: ${props => (props.used ? '#059062' : primaryBlack)};
		cursor: pointer;
	}
`;

const EmailParamListContainer = styled(FlexRow)`
	flex-wrap: wrap;
	margin-top: 2rem;
`;

const EmailParamList = ({params, editor, paramsUsed}) => (
	<EmailParamListContainer>
		{params.map(param => (
			<Param
				used={paramsUsed.includes(param.param.name)}
				onClick={e => {
					e.preventDefault();
					editor.insertInlineAtRange(editor.value.selection, {
						data: {param: param.param},
						nodes: [
							{
								object: 'text',
								leaves: [
									{
										text: LABEL_EMAIL_PARAM[
											param.param.name
										].text()
									}
								]
							}
						],
						type: 'param'
					});

					// can't seem to get focus any other way
					setTimeout(() => editor.focus(), 0);
				}}
			>
				{LABEL_EMAIL_PARAM[param.param.name].text()}
			</Param>
		))}
	</EmailParamListContainer>
);

export default EmailParamList;
