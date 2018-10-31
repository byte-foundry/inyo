import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {Redirect, withRouter} from 'react-router-dom';

import CreateQuoteForm from './create-quote-form';
import {GET_USER_CUSTOMERS} from '../../../utils/queries';
import {gray50, Button} from '../../../utils/content';

const CreateQuoteMain = styled('div')`
	margin-left: 40px;
	margin-right: 40px;
`;

const BackButton = styled(Button)`
	padding: 10px 5px;
	font-size: 11px;
	margin: 10px 0 10px 0;
	color: ${gray50};
`;

const Loading = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

class CreateQuote extends Component {
	render() {
		const {history} = this.props;

		return (
			<Query query={GET_USER_CUSTOMERS}>
				{({loading, error, data}) => {
					if (loading) return <Loading>Chargement...</Loading>;
					if (data && data.me) {
						const {customers} = data.me.company;

						return (
							<CreateQuoteMain>
								<BackButton
									theme="Link"
									size="XSmall"
									onClick={() => this.props.history.push('/app/quotes')
									}
								>
									Retour à la liste des devis
								</BackButton>
								<CreateQuoteForm
									customers={customers}
									onCreate={(newQuote) => {
										history.push(
											`/app/quotes/${newQuote.id}/edit`,
										);
									}}
								/>
							</CreateQuoteMain>
						);
					}

					return <Redirect to="/app/auth" />;
				}}
			</Query>
		);
	}
}

export default withRouter(CreateQuote);
