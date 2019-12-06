import styled from "@emotion/styled";
import React from "react";

import { FlexRow } from "../../utils/content";
import {
	lightGrey,
	mediumGrey,
	primaryBlack
} from "../../utils/new/design-system";

const Param = styled("div")`
	margin: 0 0 0.5rem 0.5rem;
	background: ${lightGrey};
	color: #505050;
	border-radius: 20px;
	padding: 8px 18px;
	font-size: 12px;

	&:hover {
		background: ${mediumGrey};
		color: ${primaryBlack};
		cursor: pointer;
	}
`;

const EmailParamListContainer = styled(FlexRow)`
	flex-wrap: wrap;
	margin-top: 2rem;
`;

const EmailParamList = ({ params, editor }) => {
	return (
		<EmailParamListContainer>
			{params.map(param => (
				<Param
					onClick={e => {
						e.preventDefault();
						editor.insertInlineAtRange(editor.value.selection, {
							data: { param: param.param },
							nodes: [
								{
									object: "text",
									leaves: [
										{
											text: param.param.name
										}
									]
								}
							],
							type: "param"
						});

						// can't seem to get focus any other way
						setTimeout(() => editor.focus(), 0);
					}}
				>
					{param.param.name}
				</Param>
			))}
		</EmailParamListContainer>
	);
};

export default EmailParamList;
