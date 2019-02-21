import React from 'react';
import styled from '@emotion/styled/macro';
import {css} from '@emotion/core';
import Shevy from 'shevyjs';
import {Link} from 'react-router-dom';

export const primaryPurple = '#5020ee';
export const primaryWhite = '#fff';
export const primaryRed = '#ff3366';
export const primaryGrey = '#888';
export const accentGrey = '#c7c7c7';
export const lightGrey = '#fafafa';
export const mediumGrey = '#eee';
export const primaryBlack = '#333';

const shevy = new Shevy({
	baseFontSize: '14px',
});

const {body} = shevy;

export const Body = styled('div')`
	${body};
	padding: 3rem;
`;

export const Button = styled('button')`
	font-size: 13px;
	margin-left: 5px;
	font-family: 'Work Sans', sans-serif;
	padding: 0.3rem 0.8rem;
	border: 2px solid #333;
	border-radius: 30px;
	cursor: pointer;
	text-decoration: none;
	background: ${(props) => {
		if (props.primary) {
			return primaryPurple;
		}
		if (props.white) {
			return 'transparent';
		}
		return primaryWhite;
	}};
	color: ${(props) => {
		if (props.primary) {
			return primaryWhite;
		}
		if (props.red) {
			return primaryRed;
		}
		if (props.grey) {
			return primaryGrey;
		}
		if (props.white) {
			return primaryWhite;
		}
		return primaryPurple;
	}};
	border-color: currentColor;

	&:hover {
		background: ${(props) => {
		if (props.red) {
			return primaryRed;
		}
		if (props.white) {
			return primaryWhite;
		}
		return primaryPurple;
	}};
		color: ${(props) => {
		if (props.white || props.link) {
			return primaryPurple;
		}
		return primaryWhite;
	}};
		border-color: ${(props) => {
		if (props.primary) {
			return 'transparent';
		}
		if (props.red) {
			return primaryRed;
		}
		if (props.white) {
			return primaryWhite;
		}
		return primaryPurple;
	}};

		&::before {
			color: currentColor;
		}
	}
	${props => props.textIcon
		&& `
		font-weight: 600;
	`}

	${props => props.big
		&& `
		font-size: 14px;
		font-weight: 600;
		padding: .8rem 1.6rem;
	`}

	${props => props.icon
		&& `&::before {
			content: '${props.icon}';
			margin-right: .4rem;
			color: currentColor;
			font-weight: 600;
		}`};

	${props => props.tiny
		&& `
		padding: 0;
		width: 30px;
		height: 30px;
	`}

	${props => props.link
		&& css`
			padding: 0;
			margin: 0;
			border: none;
			background: none;

			:hover {
				border: none;
				background: none;
			}
		`}
`;

export const ButtonLink = Button.withComponent(Link);

export const ProjectHeading = styled('div')`
	color: ${accentGrey};
	font-size: 32px;
`;

export const TaskHeading = styled('h2')`
	color: ${primaryGrey};
	font-size: 18px;
	font-weight: 400;
	flex: 1 0
		${props => (props.small ? 'calc(100% - 458px)' : 'calc(100% - 168px)')};
`;

export const SubHeading = styled('div')`
	text-transform: uppercase;
	font-size: 12px;
	letter-spacing: 0.5px;
	color: ${accentGrey};
`;

export const P = styled('p')`
	font-size: 14px;
	line-height: 1.4em;
	color: ${primaryGrey};
`;

export const Label = styled('label')`
	font-size: 14px;
	color: ${primaryGrey};
`;

export const A = styled('a')`
	font-size: inherit;
	color: ${primaryPurple};
	text-decoration: none;
	border-bottom: 2px solid transparent;

	&:hover {
		border-color: ${primaryPurple};
		transition: border-color 200ms ease;
	}
`;

export const CommentIcon = styled('div')`
	display: flex;
	position: relative;
	width: 22px;
	height: 16px;
	margin-top: -2px;
	background-color: ${mediumGrey};
	color: ${(props) => {
		if (props.new) {
			return primaryWhite;
		}
		if (props.old) {
			return primaryBlack;
		}
		return primaryPurple;
	}};
	font-size: 12px;
	text-align: center;
	cursor: pointer;
	justify-content: center;
	align-items: center;

	&:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};

		&::after {
			border-color: ${primaryPurple} transparent transparent transparent;
		}
	}

	&::after {
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		left: calc(50% - 4px);
		top: 100%;
		border-style: solid;
		border-width: 4px 4px 0 4px;
		border-color: ${mediumGrey} transparent transparent transparent;
	}
`;

const TaskInfosContent = styled('div')`
	color: ${primaryPurple};
	padding-bottom: 0;
	display: flex;
	border-bottom: solid 1px transparent;
`;

export const TaskInfosItem = styled('div')`
	display: flex;
	margin-right: 1rem;
	font-size: 14px;
	cursor: pointer;
	align-items: center;
	height: 30px;

	${props => (props.inactive
		? ''
		: `&:hover ${TaskInfosContent} {
			color: ${accentGrey};
			border-bottom: 1px dotted ${primaryPurple};
		}`)}
`;

export function TaskIconText({icon, content, ...rest}) {
	return (
		<TaskInfosItem {...rest}>
			{icon}
			<TaskInfosContent>{content}</TaskInfosContent>
		</TaskInfosItem>
	);
}

export const LayoutMainElem = styled('div')``;
