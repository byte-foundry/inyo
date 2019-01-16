import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import styled from '@emotion/styled';
import {
	FlexRow, P, Button, gray70, gray10,
} from '../../utils/content';
import thumbDownIcon from '../../utils/icons/thumbDown.svg';
import {ReactComponent as AppLogo} from '../App/appLogo.svg';

const ReporterMain = styled('div')`
	padding: 20px 40px;
`;

const ReporterRow = styled(FlexRow)`
	position: absolute;
	left: 0;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	height: 40vh;
	padding: 5%;
	background: ${gray10};
	align-items: center;
`;

const ErrorTitle = styled('div')`
	position: absolute;
	top: 83%;
	left: 0px;
	font-size: 70px;
	color: #171a44;
	transform: rotate(-90deg);
	text-transform: uppercase;
	transform-origin: left;
`;

const ErrorText = styled('div')`
	position: relative;
	padding-left: 60px;
`;

const ReporterIcon = styled('div')`
	height: 100%;
	width: 25%;
	background-image: url("${thumbDownIcon}");
	background-size: 75%;
	background-repeat: no-repeat;
	background-position: left center;
`;

const ErrorCode = styled('span')`
	border: 1px solid ${gray70};
	padding: 15px 16px;
	margin-top: 10px;
	display: block;
`;

class SentryReporter extends Component {
	constructor(props) {
		super(props);
		this.state = {error: null};
	}

	componentDidCatch(error, errorInfo) {
		this.setState({error});
		Sentry.withScope((scope) => {
			Object.keys(errorInfo).forEach((key) => {
				scope.setExtra(key, errorInfo[key]);
			});
			Sentry.captureException(error);
		});
	}

	render() {
		if (this.state.error) {
			// render fallback UI
			return (
				<ReporterMain>
					<AppLogo />
					<ReporterRow>
						<ReporterIcon />
						<ErrorText>
							<ErrorTitle>Erreur</ErrorTitle>
							<P>
								Nous sommes désolés, quelque chose ne s'est pas
								passé comme prévu.
							</P>
							<P>
								Nous vous invitons à{' '}
								<Button
									theme="Link"
									size="XSmall"
									onClick={() => {
										this.props.history.replace('/app');
										window.location.reload();
									}}
								>
									revenir à la page d'accueil
								</Button>
								. Si vous souhaitez nous aider, vous pouvez
								aussi nous{' '}
								<Button
									theme="Link"
									size="XSmall"
									onClick={() => Sentry.showReportDialog()}
								>
									transmettre cette erreur
								</Button>
								.
							</P>
							<P>
								Voici l'erreur en question : <br />
								<ErrorCode>
									<code>{this.state.error.toString()}</code>
								</ErrorCode>
							</P>
						</ErrorText>
					</ReporterRow>
				</ReporterMain>
			);
		}
		// when there's not an error, render children untouched
		return this.props.children;
	}
}

export default withRouter(SentryReporter);
