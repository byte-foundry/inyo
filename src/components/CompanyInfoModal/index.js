import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query, Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';

import {GET_USER_INFOS} from '../../utils/queries';
import {SEND_QUOTE} from '../../utils/mutations';

import {
	ModalContainer,
	ModalElem,
	ModalCloseIcon,
	ModalRow,
	H5,
} from '../../utils/content';

import UserCompanyForm from '../UserCompanyForm';

class CompanyInfoModal extends Component {
	render() {
		const {submit, quoteId} = this.props;

		return (
			<Query query={GET_USER_INFOS}>
				{({loading, error, data}) => {
					if (loading) return <p>Chargement...</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					const {me} = data;

					return (
						<ModalContainer>
							<ModalElem>
								<ModalRow>
									<H5>
										Pour envoyer votre devis vous devez
										compléter les informations de votre
										société
									</H5>
								</ModalRow>
								<ModalRow>
									<Mutation mutation={SEND_QUOTE}>
										{SendQuote => (
											<UserCompanyForm
												data={me.company}
												done={() => {
													submit(quoteId, SendQuote);
												}}
												buttonText="Envoyer le devis"
											/>
										)}
									</Mutation>
								</ModalRow>
							</ModalElem>
						</ModalContainer>
					);
				}}
			</Query>
		);
	}
}

export default CompanyInfoModal;
