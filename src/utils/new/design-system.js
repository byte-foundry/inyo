import styled from '@emotion/styled';

export const primaryPurple = '#5020ee';
export const primaryWhite = '#fff';
export const primaryRed = '#ff3366';
export const primaryGrey = '#828282';
export const accentGrey = '#c7c7c7';
export const primaryBlack = '#333';

export const TaskTitle = styled('button')`
	font-size: 13px;
	font-family: 'Work Sans', sans-serif;
	padding: 0.3rem 0.8rem;
	border: 2px solid #333;
	border-radius: 30px;
	cursor: pointer;
	transition: all 200ms ease;
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
`;

export const ProjectHeading = styled('div')`
	color: ${accentGrey};
	font-size: 32px;
`;

export const TaskHeading = styled('div')`
	color: ${primaryWhite};
	font-size: 18px;
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
	margin-right: 1em;
	width: 22px;
	height: 16px;
	background-color: ${primaryGrey};
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

	&::after {
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		left: calc(50% - 4px);
		top: 100%;
		border-style: solid;
		border-width: 4px 4px 0 4px;
		border-color: ${primaryGrey} transparent transparent transparent;
	}
`;
