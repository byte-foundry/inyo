import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import styled from '@emotion/styled';
import {
	FlexRow, P, Button, primaryWhite,
} from '../../utils/content';
import LostPeople from '../../utils/illustrations/404.svg';

const ReporterMain = styled('div')`
	padding: 40px;
	background-color: #0d0f25;
	display: flex;
	align-items: center;
	flex-direction: column;
	min-height: calc(100vh - 80px);
`;

const Illus = styled('img')`
	max-width: 40%;
`;

const ReporterRow = styled(FlexRow)`
	color: ${primaryWhite};
	line-height: 1.8;
	text-align: center;
	max-width: 1000px;
	margin: 0 auto;
`;

const ErrorText = styled('div')`
	padding: 2em;
`;

const ErrorCode = styled('span')`
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 50px;
	padding: 1rem;
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
					<Illus src={LostPeople} />
					<ReporterRow>
						<ErrorText>
							<h1>Oops.</h1>
							Nous sommes désolés, quelque chose ne s'est pas
							passé comme prévu.
							<br />
							<br />
							Nous vous invitons à{' '}
							<Link
								to="/app"
								onClick={() => {
									this.setState({error: null});
								}}
							>
								revenir à la page d'accueil
							</Link>
							. Si vous souhaitez nous aider, vous pouvez aussi
							nous{' '}
							<Button
								theme="Link"
								size="XSmall"
								onClick={() => {
									Sentry.showReportDialog();
								}}
							>
								transmettre cette erreur
							</Button>
							. Voici l'erreur en question:
							<br />
							<br />
							<br />
							<ErrorCode>
								<code>{this.state.error.toString()}</code>
							</ErrorCode>
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
