import styled from "@emotion/styled";
import { Editor, EditorState, AtomicBlockUtils } from "draft-js";
import React, { useState } from "react";

import { FlexRow } from "../../utils/content";

const Param = styled("div")`
	margin-right: 1rem;
`;

const MailContainer = styled("div")`
	border: 1px solid #f1f3f4;
	box-sizing: border-box;
	box-shadow: 4px 4px 9px rgba(0, 0, 0, 0.12);
	border-radius: 12px;
`;
const MailContent = styled("div")`
	padding: 1rem;
`;
const MailTopBar = styled("div")`
	background: #e6e6e6;
	border-radius: 8px 8px 0px 0px;
	height: 1.5rem;
`;
const MailAddresses = styled("div")``;
const MailFromAndTo = styled("div")`
	display: flex;
	flex-direction: row;
`;
const MailAddressLabel = styled("div")`
	font-size: 16px;
	font-weight: 500;
	color: #777;
	margin-right: 0.7rem;
`;
const MailAddress = styled("div")`
	font-size: 16px;
`;
const MailSubject = styled("div")`
	display: flex;
	flex-direction: row;
	border-top: 1px solid #f2f2f2;
	border-bottom: 1px solid #f2f2f2;
	padding: 0.5rem 0;
	margin: 0.5rem 0;

	& .DraftEditor-root {
		flex: 1;
	}
`;
const MailSubjectLabel = styled("div")`
	font-size: 16px;
	font-weight: 500;
	color: #777;
	margin-right: 0.7rem;
`;
const MailText = styled("div")`
	& .public-DraftEditor-content {
		min-height: 150px;
	}
`;

const EmailCustomizer = ({ emailType }) => {
	const [contentState, setContentState] = useState(EditorState.createEmpty());
	const [subjectState, setSubjectState] = useState(EditorState.createEmpty());

	return (
		<div>
			<FlexRow>
				{emailType.availableParams.map(param => (
					<Param
						onClick={() => {
							const newState = AtomicBlockUtils.insertAtomicBlock(
								contentState,
								"param",
								param.label
							);
							setContentState(newState);
						}}
					>
						{param.label}
					</Param>
				))}
			</FlexRow>
			<div>S'envoyer un email de test</div>
			<MailContainer>
				<MailTopBar />
				<MailContent>
					<MailAddresses>
						<MailFromAndTo>
							<MailAddressLabel>De :</MailAddressLabel>
							<MailAddress>toto@gmail.com</MailAddress>
						</MailFromAndTo>
						<MailFromAndTo>
							<MailAddressLabel>À :</MailAddressLabel>
							<MailAddress>tutu@hotmail.fr</MailAddress>
						</MailFromAndTo>
					</MailAddresses>
					<MailSubject>
						<MailSubjectLabel>Objet :</MailSubjectLabel>
						<Editor
							style={{ flex: 1, background: "red" }}
							editorState={subjectState}
							onChange={setSubjectState}
						/>
					</MailSubject>
					<MailText>
						<Editor
							editorState={contentState}
							onChange={setContentState}
						/>
					</MailText>
				</MailContent>
			</MailContainer>
		</div>
	);
};

export default EmailCustomizer;
