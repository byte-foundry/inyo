import styled from "@emotion/styled";
import { Editor } from "slate-react";
import { Value } from "slate";
import React, { useState, useRef, useEffect } from "react";
import { Prompt } from "react-router";

import fbt from "../../fbt/fbt.macro";
import { useQuery, useMutation } from "../../utils/apollo-hooks";
import { Loading } from "../../utils/content";
import {
	Button,
	primaryGrey,
	mediumGrey,
	primaryBlack,
	primaryPurple,
	lightGrey,
	mediumPurple,
	primaryWhite
} from "../../utils/new/design-system";
import {
	SEND_CUSTOM_EMAIL_PREVIEW,
	UPDATE_EMAIL_TEMPLATE,
	SET_TEMPLATE_TO_DEFAULT
} from "../../utils/mutations";
import { GET_EMAIL_TEMPLATE } from "../../utils/queries";
import EmailParamList from "../EmailParamList";
import CustomEmailTimingInput from "../CustomEmailTimingInput";
import useUserInfos from "../../utils/useUserInfos";

const MailContainer = styled("div")`
	border: 1px solid #f1f3f4;
	box-sizing: border-box;
	box-shadow: 4px 4px 9px rgba(0, 0, 0, 0.12);
	border-radius: 12px;
	margin-bottom: 3rem;
	padding-bottom: 2rem;
`;
const MailContent = styled("div")`
	padding: 1rem;
	color: ${primaryGrey};
`;

const MailTopBar = styled("div")`
	background: #e6e6e6;
	border-radius: 8px 8px 0px 0px;
	height: 1.5rem;
	position: relative;

	&::before {
		content: "···";
		font-size: 70px;
		position: relative;
		top: 11px;
		left: 1rem;
		line-height: 0;
		color: ${primaryGrey};
		-webkit-text-stroke: 1px ${primaryGrey};
		-webkit-text-fill-color: transparent;
	}
`;
const MailAddresses = styled("div")``;
const MailFromAndTo = styled("div")`
	display: flex;
	flex-direction: row;
	text-transform: lowercase;
`;
const MailAddressLabel = styled("div")`
	font-size: 16px;
	font-weight: 500;
	color: #777;
	margin-right: 0.7rem;
	text-transform: capitalize;
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
	color: ${primaryPurple};
	border-radius: 30px;
	padding: 3px 12px;

	&:hover {
		cursor: pointer;
		color: ${primaryPurple};
		background-color: ${lightGrey};
	}
`;

const MailText = styled("div")`
	padding-top: 2rem;
	line-height: 1.7;
	color: ${primaryBlack};
`;

const ParamDisplay = styled("span")`
	background: ${props => (props.isSelected ? primaryPurple : lightGrey)};
	border-radius: 20px;
	padding: 0px 10px 2px;
	color: ${props => (props.isSelected ? primaryWhite : primaryPurple)};
	border: 1px solid transparent;
	user-select: none;

	&:hover {
		border: 1px solid ${primaryPurple};
		color: ${primaryPurple};
		cursor: pointer;
		transition: 200ms all ease;
	}
`;

const ButtonsWrap = styled("div")`
	display: flex;
	justify-content: space-between;
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

const compareStateAndData = (state, template) => {
	return (
		(template.timing === null ||
			(state.timing.value === template.timing.value &&
				state.timing.unit === template.timing.unit &&
				state.timing.isRelative === template.timing.isRelative)) &&
		state.subject === template.subject &&
		state.content === template.content
	);
};

const EmailCustomizer = ({ emailType }) => {
	const { assistantName } = useUserInfos();
	const [stateIsUnchanged, setStateIsUnchange] = useState();
	const [unit, setUnit] = useState();
	const [value, setValue] = useState();
	const [isRelative, setIsRelative] = useState();
	const [initialSubject, setInitialSubject] = useState();
	const [initialContent, setInitialContent] = useState();
	const [contentValue, setContentValue] = useState(
		Value.fromJSON(initialValue)
	);
	const [subjectValue, setSubjectValue] = useState(
		Value.fromJSON(initialValue)
	);
	const contentEditorRef = useRef();
	const subjectEditorRef = useRef();
	const [focusedEditorRef, setFocusedEditorRef] = useState(contentEditorRef);
	const { data, loading, error } = useQuery(GET_EMAIL_TEMPLATE, {
		variables: {
			typeName: emailType.name,
			category: emailType.category
		}
	});
	const [sendCustomEmailPreview] = useMutation(SEND_CUSTOM_EMAIL_PREVIEW);
	const [updateEmailTemplate] = useMutation(UPDATE_EMAIL_TEMPLATE);
	const [setTemplateToDefault] = useMutation(SET_TEMPLATE_TO_DEFAULT);

	const paramsUsed = [
		...contentValue.document
			.filterDescendants(block => block.type === "param")
			.map(param => param.text),
		...subjectValue.document
			.filterDescendants(block => block.type === "param")
			.map(param => param.text)
	];

	useEffect(() => {
		if (!loading) {
			const subject = Value.fromJSON(data.emailTemplate.subject);
			const content = Value.fromJSON(data.emailTemplate.content);

			setInitialSubject(subject);
			setInitialContent(content);
			setSubjectValue(subject);
			setContentValue(content);
			if (data.emailTemplate.timing) {
				setUnit(data.emailTemplate.timing.unit);
				setValue(data.emailTemplate.timing.value);
				setIsRelative(data.emailTemplate.timing.isRelative);
			}
		}
	}, [loading, data]);

	useEffect(() => {
		if (!loading) {
			setStateIsUnchange(
				compareStateAndData(
					{
						timing: {
							unit,
							value,
							isRelative
						},
						subject: subjectValue,
						content: contentValue
					},
					{
						timing: data.emailTemplate.timing,
						subject: initialSubject,
						content: initialContent
					}
				)
			);
		}
	}, [
		loading,
		data,
		unit,
		value,
		isRelative,
		subjectValue,
		contentValue,
		initialValue,
		initialContent
	]);

	if (loading) {
		return (
			<div style={{ flex: 1 }}>
				<Loading />
			</div>
		);
	}

	return (
		<div style={{ flex: 1, marginTop: "1.5rem" }}>
			{data.emailTemplate.timing && (
				<CustomEmailTimingInput
					unit={unit}
					value={value}
					isRelative={isRelative}
					setUnit={setUnit}
					setValue={setValue}
					setIsRelative={setIsRelative}
				/>
			)}
			<EmailParamList
				params={emailType.availableParams}
				editor={focusedEditorRef.current}
				paramsUsed={paramsUsed}
			/>
			<TestEmailLinkContainer>
				<TestEmailLink
					onClick={() => {
						sendCustomEmailPreview({
							variables: {
								templateId: data.emailTemplate.id
							}
						});
					}}
				>
					S'envoyer un email de test
				</TestEmailLink>
			</TestEmailLinkContainer>
			<MailContainer>
				<MailTopBar />
				<MailContent>
					<MailAddresses>
						<MailFromAndTo>
							<MailAddressLabel>De :</MailAddressLabel>
							<MailAddress>{assistantName}@inyo.me</MailAddress>
						</MailFromAndTo>
						<MailFromAndTo>
							<MailAddressLabel>À :</MailAddressLabel>
							<MailAddress>mail@client.com</MailAddress>
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
							style={{ minHeight: "100px", fontSize: "16px" }}
						/>
					</MailText>
				</MailContent>
			</MailContainer>
			<ButtonsWrap>
				<Button
					link
					red
					onClick={() =>
						setTemplateToDefault({
							variables: {
								templateId: data.emailTemplate.id
							}
						})
					}
				>
					<fbt desc="back to default template">
						Revenir au modèle par défaut
					</fbt>
				</Button>
				<Button
					onClick={() => {
						// console.log('Suject');
						// console.log(JSON.stringify(subjectEditorRef.current.value));
						// console.log('Content');
						// console.log(JSON.stringify(contentEditorRef.current.value));
						updateEmailTemplate({
							variables: {
								templateId: data.emailTemplate.id,
								timing: {
									unit,
									value,
									isRelative
								},
								subject: subjectEditorRef.current.value,
								content: contentEditorRef.current.value
							}
						});
					}}
				>
					Enregistrer ce modèle
				</Button>
			</ButtonsWrap>
			<Prompt
				when={!stateIsUnchanged}
				message="Vous avez des changements non sauvegardés. Etes-vous sûr de vouloir quitter la page ?"
				messageTranslated={
					<fbt desc="unsaved changes">
						Vous avez des changements non sauvegardés. Etes-vous sûr
						de vouloir quitter la page ?
					</fbt>
				}
			/>
		</div>
	);
};

export default EmailCustomizer;
