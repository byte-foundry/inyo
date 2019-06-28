import '@reach/dialog/styles.css';

import {css} from '@emotion/core';
import styled from '@emotion/styled';
import {Dialog} from '@reach/dialog';
import React, {useLayoutEffect} from 'react';
import {Link} from 'react-router-dom';
import Shevy from 'shevyjs';

import {
	gray10,
	gray30,
	gray50,
	gray70,
	gray80,
	primaryBlue,
	primaryNavyBlue,
	primaryWhite,
	signalGreen,
	signalOrange,
	signalRed,
} from './colors';
import {BREAKPOINTS} from './constants';
import {ReactComponent as InyoLogo} from './icons/inyo-topbar-logo.svg';
import {primaryBlack, primaryGrey, primaryRed} from './new/design-system';

export * from './colors';

const shevy = new Shevy({
	baseFontSize: '17px',
});
const {
	content, h1, h2, h3, h4, h5, h6,
} = shevy;

// Typography

export const H1 = styled('h1')`
	${h1};
	color: ${primaryBlack};
	font-weight: 700;
	line-height: 1.4;
`;
export const H2 = styled('h2')`
	${h2};
	color: ${primaryBlack};
	font-weight: 700;
	line-height: 1.4;
`;
export const H3 = styled('h3')`
	${h3};
	color: ${primaryBlack};
	font-weight: 400;
	line-height: 1.4;
`;
export const H4 = styled('h4')`
	${h4};
	color: ${primaryBlack};
	font-weight: 400;
	line-height: 1.4;
`;
export const H5 = styled('h5')`
	${h5};
	color: ${primaryBlack};
	font-weight: 400;
	line-height: 1.4;
`;
export const H6 = styled('h6')`
	${h6};
	color: ${primaryBlack};
	font-weight: 400;
	line-height: 1.4;
`;
export const P = styled('p')`
	${content};
	color: ${primaryGrey};
	font-size: 1rem;
	line-height: 1.6;
`;
export const Ol = styled('ol')`
	${content};
	color: ${primaryBlack};
`;
export const Ul = styled('ul')`
	${content};
	color: ${primaryBlack};
`;
export const A = styled('a')`
	${content};
	color: ${primaryBlue};
`;

// Buttons

const buttonResetStyles = css`
	border: 1px solid transparent;
	margin: 0;
	padding: 0;
	width: auto;
	overflow: visible;
	background: transparent;
	color: inherit;
	font: inherit;
	line-height: normal;
	-webkit-font-smoothing: inherit;
	-moz-osx-font-smoothing: inherit;
	-webkit-appearance: none;
	&::-moz-focus-inner {
		border: 0;
		padding: 0;
	}
`;

const ButtonStyles = (props) => {
	switch (props.theme) {
	case 'Primary':
		return css`
				background-color: ${primaryBlue};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${primaryBlue};
					color: ${primaryBlue};
				}
			`;
	case 'Link':
		return css`
				background-color: transparent;
				color: ${primaryBlue};
				text-decoration: underline;
				display: inline;
				svg {
					max-width: 20px;
					margin-right: 0.5rem;
				}
			`;
	case 'DeleteOutline':
		return css`
				background-color: transparent;
				color: ${signalRed};
				text-decoration: underline;
			`;
	case 'Outline':
		return css`
				border-color: ${primaryBlue};
				background-color: transparent;
				color: ${primaryBlue};
				&:hover,
				&:focus {
					background-color: ${primaryBlue};
					border-color: transparent;
					color: ${primaryWhite};
				}
			`;
	case 'Disabled':
		return css`
				border-color: ${gray70};
				color: ${gray30};
				cursor: initial;
			`;
	case 'PrimaryNavy':
		return css`
				background-color: ${primaryNavyBlue};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${primaryNavyBlue};
					color: ${primaryNavyBlue};
				}
			`;
	case 'Warning':
		return css`
				background-color: ${signalOrange};
				color: ${primaryNavyBlue};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${signalOrange};
					color: ${primaryNavyBlue};
				}
			`;
	case 'Error':
		return css`
				background-color: ${signalRed};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${signalRed};
					color: ${primaryNavyBlue};
				}
			`;
	case 'Success':
		return css`
				background-color: ${signalGreen};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${signalGreen};
					color: ${primaryNavyBlue};
				}
			`;
	default:
		return css`
				background-color: ${primaryWhite};
				border-color: ${gray70};
				color: ${gray70};
				&:hover,
				&:focus {
					background-color: ${gray50};
					border-color: ${gray70};
					color: ${gray10};
				}
			`;
	}
};

const ButtonSizes = (props) => {
	switch (props.size) {
	case 'Big':
		return css`
				padding: 23px 16px 24px 16px;
			`;
	case 'Medium':
		return css`
				padding: 14px 16px 15px 16px;
			`;
	case 'Small':
		return css`
				padding: 9px 16px 10px 16px;
			`;
	case 'XSmall':
		return css`
				padding: 0;
				width: inherit;
				vertical-align: inherit;
			`;
	default:
		return css`
				padding: 14px 16px 15px 16px;
			`;
	}
};

export const Button = styled('button')`
	${buttonResetStyles};
	width: auto;
	font-size: 17px;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	border-radius: 4px;
	${ButtonStyles};
	${ButtonSizes};
`;

export const LinkButton = styled(Link)`
	${buttonResetStyles} width: auto;
	font-size: 17px;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	border-radius: 4px;
	${ButtonStyles};
	${ButtonSizes};
	text-decoration: none;
`;

// Inputs

export const Input = styled('input')`
	display: block;
	position: relative;
	border: 1px solid ${props => (props.error ? signalRed : 'transparent')};
	padding: 15px 18px 16px 18px;
	color: ${gray50};
	width: ${props => (props.flexible ? '100%' : 'fill-available')};
	font-family: 'Work Sans', sans-serif;
	font-size: 16px;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	&::placeholder {
		color: ${gray30};
	}
	&:disabled {
		color: ${gray30};
	}
	&:focus {
		background-color: ${gray10};
	}
`;

export const Label = styled('label')`
	font-family: 'Work Sans', sans-serif;
	font-size: 15px;
	width: fill-available;
	color: ${primaryBlack};
	margin-bottom: 5px;
	line-height: 1.6;
	${props => props.required
		&& css`
			&::after {
				color: ${signalRed};
				font-size: 20px;
				transform: translateY(-6px);
				content: '*';
				padding-left: 5px;
			}
		`};
	${props => props.onboarding
		&& css`
			margin: 50px 15px 10px 16px;
			width: inherit;
		`};
`;

export const ErrorInput = styled('p')`
	font-family: 'Work Sans', sans-serif;
	width: fill-available;
	font-size: 12px;
	color: ${signalRed};
	text-align: right;
	margin-top: 2px;
	margin-bottom: 0;
`;
// Layout

export const FlexRow = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: ${props => props.justifyContent || 'flex-start'};
	${props => props.flexWrap && `flex-wrap: ${props.flexWrap};`};
`;
export const FlexColumn = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: ${props => props.justifyContent || 'flex-start'};
	${props => props.flexGrow && `flex-grow: ${props.flexGrow};`};
	${props => props.fullHeight && 'height: 100%;'};
`;

export const ToggleButton = styled('span')`
	color: ${props => (props.active ? primaryBlue : gray80)};
	cursor: pointer;
	margin-right: 20px;
	padding-top: 15px;
	padding-bottom: 10px;
	border-bottom: 4px solid
		${props => (props.active ? primaryBlue : 'transparent')};
	transition: color 0.2s ease, border-color 0.2s ease;
`;

const ResponsiveDialog = styled(Dialog)`
	width: ${(props) => {
		if (props.size === 'small') {
			return '35vw';
		}
		if (props.size === 'large') {
			return '75vw';
		}
		return '50vw';
	}};
	min-width: 500px;
	position: relative;

	@media (max-width: ${BREAKPOINTS}px) {
		min-width: initial;
		width: 100vw;
		padding: 0;
		margin-top: 13vh;
	}
`;

function useLockBodyScroll() {
	useLayoutEffect(() => {
		// Get original body overflow
		const originalStyle = window.getComputedStyle(document.body).overflow;
		// Prevent scrolling on mount

		document.body.style.overflow = 'hidden';
		// Re-enable scrolling when component unmounts
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []); // Empty array ensures effect is only run on mount and unmount
}

export function ModalContainer({noClose, children, ...props}) {
	useLockBodyScroll();

	return (
		<ResponsiveDialog {...props}>
			{!noClose && (
				<ModalCloseIcon onClick={props.onDismiss}>×</ModalCloseIcon>
			)}
			{children}
		</ResponsiveDialog>
	);
}

export const ModalActions = styled('div')`
	grid-column: 1 / 4;
	display: flex;
	justify-content: flex-end;
	margin-top: 3rem;

	button + button {
		margin-left: 2rem;
	}
`;

export const ModalElem = styled('div')`
	position: relative;
	padding: 2rem;
`;

export const ModalCloseIcon = styled('div')`
	position: absolute;
	color: ${primaryRed};
	font-size: 2.5rem;
	position: absolute;
	top: -3rem;
	right: -3rem;
	cursor: pointer;

	transition: all 200ms ease;

	background-color: ${primaryWhite};
	border-radius: 50%;
	width: 3rem;
	text-align: center;

	&:hover {
		background-color: ${primaryRed};
		color: ${primaryWhite};
	}

	@media (max-width: ${BREAKPOINTS}px) {
		right: 0;
		top: -4.1rem;
		font-size: 2rem;
		background: transparent;
	}
`;

export const ModalRow = styled('div')`
	padding-left: 40px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const LoadingMain = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

export const LoadingLogo = styled(InyoLogo)`
	animation: breathing 2s ease-out infinite normal;

	@keyframes breathing {
		0% {
			transform: scale(0.9);
		}
		25% {
			transform: scale(1.2);
		}
		60% {
			transform: scale(0.7);
		}
		100% {
			transform: scale(0.9);
		}
`;

export const Loading = () => (
	<LoadingMain>
		<LoadingLogo />
	</LoadingMain>
);

export const ProjectDataMain = styled('div')`
	margin-top: 10px;
`;
export const ProjectDataElem = styled('div')`
	padding-top: 15px;
	padding-bottom: 15px;
`;
export const ProjectDataLabel = styled(H6)`
	font-size: 13px;
	margin: 0;
	margin-bottom: 10px;
	text-transform: uppercase;
`;

export const DateInput = styled(Input)`
	background: ${primaryWhite};
	border-left: ${props => (props.alone ? 'solid 1px' : 'none')};
	border-color: ${primaryBlue};
	color: ${primaryNavyBlue};
	margin-right: 10px;
	padding: 18px 5px;
	&:focus {
		outline: none;
	}
	width: ${props => (props.wide ? '100%' : 'auto')};
`;
