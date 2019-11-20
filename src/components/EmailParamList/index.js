import styled from "@emotion/styled";
import React from "react";

import { FlexRow } from "../../utils/content";

const Param = styled("div")`
	margin-right: 1rem;
	background: #f1f3f4;
	border-radius: 20px;
	padding: 10px 18px;
	margin-bottom: 0.5rem;
`;

const EmailParamListContainer = styled(FlexRow)`
	flex-wrap: wrap;
`;

const EmailParamList = ({ params, editor }) => {
	return (
		<EmailParamListContainer>
			{params.map(param => (
				<Param
					onClick={e => {
						e.preventDefault();
						editor.insertInlineAtRange(editor.value.selection, {
							data: {},
							nodes: [
								{
									object: "text",
									leaves: [
										{
											text: param.label
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
					{param.label}
				</Param>
			))}
		</EmailParamListContainer>
	);
};

export default EmailParamList;
