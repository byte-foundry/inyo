import styled from "@emotion/styled";
import { Editor } from "slate-react";
import { Value } from "slate";
import React, { useState, useRef } from "react";

import EmailParamList from "../EmailParamList";

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
`;
const MailSubjectLabel = styled("div")`
	font-size: 16px;
	font-weight: 500;
	color: #777;
	margin-right: 0.7rem;
`;
const TestEmailLinkContainer = styled("div")`
	display: flex;
	justify-content: flex-end;
	flex: column;
	margin-bottom: 1rem;
`;
const TestEmailLink = styled("div")`
	color: #684ebc;
`;
const MailText = styled("div")``;

const ParamDisplay = styled("span")`
	background: ${props => (props.isSelected ? "#684EBC" : "#F1F3F4")};
	border-radius: 20px;
	padding: 2px 12px;
	color: ${props => (props.isSelected ? "#F1F3F4" : "#684EBC")};
	user-select: none;
`;

const renderInline = ({ attributes, node, isSelected }, editor, next) => {
	if (node.type === "param") {
		return (
			<ParamDisplay isSelected={isSelected} {...attributes}>
				{node.text}
			</ParamDisplay>
		);
	}

	return next();
};

const schema = {
	inlines: {
		param: {
			isVoid: true
		}
	}
};

const initialValue = {
	object: "value",
	document: {
		object: "document",
		nodes: [
			{
				object: "block",
				type: "paragraph",
				nodes: [
					{
						object: "text",
						text: ""
					}
				]
			}
		]
	}
};

const EmailCustomizer = ({ emailType }) => {
	const [contentValue, setContentValue] = useState(
		Value.fromJSON(initialValue)
	);
	const [subjectValue, setSubjectValue] = useState(
		Value.fromJSON(initialValue)
	);
	const contentEditorRef = useRef();
	const subjectEditorRef = useRef();
	const [focusedEditorRef, setFocusedEditorRef] = useState(contentEditorRef);

	return (
		<div>
			<EmailParamList
				params={emailType.availableParams}
				editor={focusedEditorRef.current}
			/>
			<TestEmailLinkContainer>
				<TestEmailLink>S'envoyer un email de test</TestEmailLink>
			</TestEmailLinkContainer>
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
							value={subjectValue}
							ref={subjectEditorRef}
							onChange={({ value }) => setSubjectValue(value)}
							renderInline={renderInline}
							onFocus={() => {
								setFocusedEditorRef(subjectEditorRef);

								// can't seem to get focus any other way
								setTimeout(
									() => subjectEditorRef.current.focus(),
									0
								);
							}}
							schema={schema}
							style={{ flex: 1, fontSize: "16px" }}
						/>
					</MailSubject>
					<MailText>
						<Editor
							value={contentValue}
							ref={contentEditorRef}
							onChange={({ value }) => setContentValue(value)}
							renderInline={renderInline}
							onFocus={() => {
								setFocusedEditorRef(contentEditorRef);

								// can't seem to get focus any other way
								setTimeout(
									() => contentEditorRef.current.focus(),
									0
								);
							}}
							schema={schema}
							style={{ height: "100px", fontSize: "16px" }}
						/>
					</MailText>
				</MailContent>
			</MailContainer>
		</div>
	);
};

export default EmailCustomizer;