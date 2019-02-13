import React from 'react';
import styled from '@emotion/styled/macro';
import Shevy from 'shevyjs';

export const primaryPurple = '#5020ee';
export const primaryWhite = '#fff';
export const primaryRed = '#ff3366';
export const primaryGrey = '#888';
export const accentGrey = '#c7c7c7';
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
	background: ${(props) => {
		if (props.primary) {
			return primaryPurple;
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
		return primaryPurple;
	}};
	border-color: ${(props) => {
		if (props.red) {
			return primaryRed;
		}
		if (props.grey) {
			return accentGrey;
		}
		return primaryPurple;
	}};

	&:hover {
		background: ${(props) => {
		if (props.red) {
			return primaryRed;
		}
		return primaryPurple;
	}};
		color: ${primaryWhite};
		border-color: ${(props) => {
		if (props.primary) {
			return 'transparent';
		}
		if (props.red) {
			return primaryRed;
		}
		return primaryPurple;
	}};

		&::before {
			color: ${primaryWhite};
		}
	}

	${props => props.icon
		&& `&::before {
			content: '${props.icon}';
			margin-right: .4rem;
			color: ${primaryPurple};
			font-weight: 600;
		}`};
`;

export const ProjectHeading = styled('div')`
	color: ${accentGrey};
	font-size: 32px;
`;

export const TaskHeading = styled('h2')`
	color: ${primaryGrey};
	font-size: 18px;
	font-weight: 400;
	flex: 1 0 calc(100% - 168px);
`;

export const SubHeading = styled('div')`
	text-transformation: 'uppercase';
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
		border-color: ${primaryPurple}
		transition: border-color 200ms ease;
	}
`;

export const CommentIcon = styled('div')`
	display: flex;
	position: relative;
	width: 22px;
	height: 16px;
	background-color: ${accentGrey};
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
		border-color: ${accentGrey} transparent transparent transparent;
	}
`;

const TaskInfosContent = styled('div')`
	color: ${primaryPurple};
	padding-bottom: 0;
`;

export const TaskInfosItem = styled('div')`
	display: flex;
	margin-right: 1rem;
	font-size: 14px;
	cursor: pointer;

	&:hover ${TaskInfosContent} {
		color: ${accentGrey};
		border-bottom: 1px dotted ${primaryPurple};
	}
`;

export function TaskIconText({icon, content}) {
	return (
		<TaskInfosItem>
			{icon}
			<TaskInfosContent>{content}</TaskInfosContent>
		</TaskInfosItem>
	);
}

export const LayoutMainElem = styled('div')`
	width: 1200px;
`;
