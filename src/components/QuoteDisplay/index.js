import React, {Component} from 'react';
import styled from 'react-emotion';
import {withRouter} from 'react-router-dom';
import {Mutation, Query} from 'react-apollo';
import Select from 'react-select';

import CustomerNameAndAddress from '../CustomerNameAndAddress';
import IssuerNameAndAddress from '../IssuerNameAndAddress';
import TextEditor from '../TextEditor';
import InlineEditable from '../InlineEditable';
import QuoteSection from '../QuoteSection';
import QuoteTotal from '../QuoteTotal';
import TasksProgressBar from '../TasksProgressBar';
import {
	EDIT_ITEMS,
	UPDATE_QUOTE,
	ADD_SECTION,
	UPDATE_OPTION,
	SEND_QUOTE,
	SEND_AMENDMENT,
	ACCEPT_AMENDMENT,
	REJECT_AMENDMENT,
	ACCEPT_QUOTE,
	REJECT_QUOTE,
} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import {
	H1,
	H3,
	H5,
	H4,
	H6,
	P,
	FlexRow,
	FlexColumn,
	Button,
	primaryNavyBlue,
	primaryBlue,
	gray20,
	gray10,
	gray30,
	secondaryLightBlue,
	gray50,
	ToggleButton,
} from '../../utils/content';

import 'react-toastify/dist/ReactToastify.css';

const QuoteDisplayMain = styled('div')`
	min-height: 100vh;
`;

const BackButton = styled(Button)`
	padding: 10px 5px;
	font-size: 11px;
	margin: 10px 0 10px 40px;
	color: ${gray50};
`;

const QuoteDisplayTitle = styled(H1)`
	color: ${primaryNavyBlue};
	margin: 0;
`;

const AddOptionButton = styled('button')``;
const QuoteSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 15vw;
	padding: 20px 40px;
`;
const QuoteName = styled(H3)`
	color: ${primaryBlue};
	margin: 10px 0 20px;
`;
const CenterContent = styled(FlexColumn)`
	background: ${gray10};
	padding: 20px 40px;
`;

const QuoteRow = styled(FlexRow)`
	padding-left: 40px;
	padding-right: 40px;
	padding-top: 10px;
	padding-bottom: ${props => (props.noPadding ? '0px' : '10px')};
	border-bottom: 1px solid ${gray20};
`;

const QuoteContent = styled('div')`
	max-width: 750px;
	width: -webkit-fill-available;
	margin-left: auto;
	margin-right: auto;
	padding-bottom: 40px;
`;

const QuoteAction = styled(Button)`
	text-decoration: none;
	color: ${primaryBlue};
	font-size: 13px;
	transform: translateY(18px);
	margin-top: 10px;
	margin-bottom: 10px;
`;

const QuoteStatus = styled(FlexColumn)`
	span {
		font-size: 13px;
		margin: 5px 10px;
	}
`;

const SelectStyles = {
	option: (base, state) => ({
		...base,
		borderRadius: 0,
	}),
	menu: (base, state) => ({
		...base,
		marginTop: 2,
		borderRadius: 0,
	}),
	control: base => ({
		...base,
		width: 300,
		border: 'none',
		borderRadius: 0,
	}),
	singleValue: (base, state) => ({
		...base,
	}),
};
const SendQuoteButton = styled(Button)`
	width: auto;
`;
const Loading = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

class QuoteDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'quote',
			selectedOption: undefined,
			apolloTriggerRenderTemporaryFix: false,
		};
	}

	getQuoteTotal = (option, defaultVatRate = 20) => {
		let sumDays = 0;
		let sumHT = 0;
		let sumTTC = 0;

		option.sections.forEach((section) => {
			section.items.forEach((item) => {
				sumDays += item.pendingUnit || item.unit;
				sumHT += (item.pendingUnit || item.unit) * item.unitPrice;
				sumTTC
					+= (item.pendingUnit || item.unit) * item.unitPrice
					+ (item.pendingUnit || item.unit)
						* item.unitPrice
						* (defaultVatRate / 100);
			});
		});
		return <QuoteTotal sumDays={sumDays} sumHT={sumHT} sumTTC={sumTTC} />;
	};

	render() {
		const {
			quoteTemplates,
			quoteOption,
			quote,
			mode,
			sendQuote,
			editQuoteTitle,
			setQuoteData,
			addItem,
			editItem,
			editSectionTitle,
			removeItem,
			removeSection,
			addSection,
			updateOption,
			totalItemsFinished,
			totalItems,
			sendAmendment,
			acceptOrRejectAmendment,
			acceptOrRejectQuote,
			timePlanned,
			amendmentEnabled,
			overtime,
			issuer,
		} = this.props;
		const customerViewMode = this.props.match.params.customerToken;
		const isAcceptable = quote.status === 'SENT';
		const isAmendmentAcceptable
			= quote.status === 'ACCEPTED'
			&& quoteOption.sections.reduce(
				(optionUpdated, section) => optionUpdated
					|| section.items.reduce(
						(sectionUpdated, item) => sectionUpdated || item.status === 'UPDATED_SENT',
						optionUpdated,
					),
				false,
			);

		return (
			<Query query={GET_USER_INFOS}>
				{({loading, data}) => {
					if (loading) return <Loading>Chargement...</Loading>;
					if ((data && data.me) || customerViewMode) {
						return (
							<QuoteDisplayMain>
								{!customerViewMode && (
									<BackButton
										theme="Link"
										size="XSmall"
										onClick={() => this.props.history.push(
											'/app/quotes',
										)
										}
									>
										Retour à la liste des devis
									</BackButton>
								)}
								{mode === 'edit' && (
									<QuoteRow justifyContent="space-between">
										<QuoteDisplayTitle>
											Remplissez votre devis
										</QuoteDisplayTitle>
										<Mutation mutation={SEND_QUOTE}>
											{SendQuote => (
												<SendQuoteButton
													theme="Primary"
													size="Medium"
													onClick={() => {
														sendQuote(
															quote.id,
															SendQuote,
														);
													}}
												>
													Envoyez la proposition
												</SendQuoteButton>
											)}
										</Mutation>
									</QuoteRow>
								)}
								<QuoteRow
									noPadding
									justifyContent="space-between"
								>
									<FlexColumn>
										<QuoteName>
											<Mutation mutation={UPDATE_QUOTE}>
												{updateQuote => (
													<InlineEditable
														value={quote.name}
														type="text"
														placeholder="Name of the project"
														disabled={
															mode !== 'edit'
														}
														onFocusOut={(value) => {
															editQuoteTitle(
																value,
																quote.id,
																updateQuote,
															);
														}}
													/>
												)}
											</Mutation>
										</QuoteName>
										{mode === 'see' && (
											<TasksProgressBar
												tasksCompleted={
													totalItemsFinished
												}
												tasksTotal={totalItems}
											/>
										)}
									</FlexColumn>

									{mode === 'edit' && (
										<Mutation mutation={EDIT_ITEMS}>
											{EditItems => (
												<Select
													styles={SelectStyles}
													placeholder="Recommandation de contenu"
													onChange={(e) => {
														setQuoteData(
															e.value,
															EditItems,
														);
													}}
													options={quoteTemplates}
												/>
											)}
										</Mutation>
									)}
									{mode === 'see' && (
										<FlexRow>
											{!customerViewMode && (
												<QuoteStatus>
													<span>
														Temps prévu :{' '}
														{timePlanned}
													</span>
													{!customerViewMode && (
														<span>
															Dépassement :{' '}
															{overtime}
														</span>
													)}
												</QuoteStatus>
											)}
											{mode === 'see'
												&& !customerViewMode && (
												<Mutation
													mutation={
														SEND_AMENDMENT
													}
												>
													{SendAmendment => (
														<SendQuoteButton
															theme="Primary"
															disabled={
																!amendmentEnabled
															}
															size="Medium"
															onClick={() => {
																sendAmendment(
																	quote.id,
																	SendAmendment,
																);
															}}
														>
																Envoyez
																l'avenant
														</SendQuoteButton>
													)}
												</Mutation>
											)}
											{customerViewMode
												&& isAmendmentAcceptable && (
												<FlexColumn justifyContent="space-around">
													<Mutation
														mutation={
															ACCEPT_AMENDMENT
														}
													>
														{acceptAmendment => (
															<SendQuoteButton
																theme="Success"
																size="Small"
																onClick={() => {
																	acceptOrRejectAmendment(
																		quote.id,
																		this
																			.props
																			.match
																			.params
																			.customerToken,
																		acceptAmendment,
																	);
																}}
															>
																	Acceptez
																	l'avenant
															</SendQuoteButton>
														)}
													</Mutation>
													<Mutation
														mutation={
															REJECT_AMENDMENT
														}
													>
														{rejectAmendment => (
															<SendQuoteButton
																theme="Error"
																size="Small"
																onClick={() => {
																	acceptOrRejectAmendment(
																		quote.id,
																		this
																			.props
																			.match
																			.params
																			.customerToken,
																		rejectAmendment,
																	);
																}}
															>
																	Rejetez
																	l'avenant
															</SendQuoteButton>
														)}
													</Mutation>
												</FlexColumn>
											)}
											{customerViewMode
												&& isAcceptable && (
												<FlexColumn>
													<Mutation
														mutation={
															ACCEPT_QUOTE
														}
													>
														{acceptQuote => (
															<SendQuoteButton
																theme="Success"
																size="Small"
																onClick={() => {
																	acceptOrRejectQuote(
																		quote.id,
																		this
																			.props
																			.match
																			.params
																			.customerToken,
																		acceptQuote,
																	);
																}}
															>
																	Acceptez le
																	devis
															</SendQuoteButton>
														)}
													</Mutation>
													<Mutation
														mutation={
															REJECT_QUOTE
														}
													>
														{rejectQuote => (
															<SendQuoteButton
																theme="Error"
																size="Small"
																onClick={() => {
																	acceptOrRejectQuote(
																		quote.id,
																		this
																			.props
																			.match
																			.params
																			.customerToken,
																		rejectQuote,
																	);
																}}
															>
																	Rejetez le
																	devis
															</SendQuoteButton>
														)}
													</Mutation>
												</FlexColumn>
											)}
										</FlexRow>
									)}
								</QuoteRow>
								<QuoteRow noPadding>
									<ToggleButton
										active={this.state.mode === 'proposal'}
										onClick={(raw) => {
											this.setState({
												mode: 'proposal',
											});
										}}
									>
										Proposition
									</ToggleButton>
									<ToggleButton
										active={this.state.mode === 'quote'}
										onClick={(raw) => {
											this.setState({
												mode: 'quote',
											});
										}}
									>
										Devis
									</ToggleButton>
								</QuoteRow>
								<FlexRow justifyContent="space-between">
									<CenterContent flexGrow="2">
										<QuoteContent>
											<FlexColumn fullHeight>
												{this.state.mode === 'quote' ? (
													<QuoteSections>
														{quoteOption.sections.map(
															(
																section,
																index,
															) => (
																<QuoteSection
																	key={`section${
																		section.id
																	}`}
																	data={
																		section
																	}
																	addItem={
																		addItem
																	}
																	editItem={
																		editItem
																	}
																	customerViewMode={
																		customerViewMode
																	}
																	mode={mode}
																	editSectionTitle={
																		editSectionTitle
																	}
																	removeItem={
																		removeItem
																	}
																	removeSection={
																		removeSection
																	}
																	sectionIndex={
																		index
																	}
																/>
															),
														)}
														{mode === 'edit' && (
															<Mutation
																mutation={
																	ADD_SECTION
																}
															>
																{AddSection => (
																	<QuoteAction
																		theme="Link"
																		size="XSmall"
																		onClick={() => {
																			addSection(
																				quoteOption.id,
																				AddSection,
																			);
																		}}
																	>
																		Ajouter
																		une
																		section
																	</QuoteAction>
																)}
															</Mutation>
														)}
													</QuoteSections>
												) : (
													<Mutation
														mutation={UPDATE_OPTION}
													>
														{UpdateOption => (
															<TextEditor
																disabled={
																	mode
																	!== 'edit'
																}
																currentContent={
																	quoteOption.proposal
																}
																onChange={(raw) => {
																	updateOption(
																		quoteOption.id,
																		raw,
																		UpdateOption,
																	);
																}}
															/>
														)}
													</Mutation>
												)}
											</FlexColumn>
										</QuoteContent>
									</CenterContent>
									<SideActions>
										{customerViewMode
											&& issuer.name && (
											<IssuerNameAndAddress
												issuer={issuer}
											/>
										)}
										<CustomerNameAndAddress
											customer={quote.customer}
										/>
										{this.getQuoteTotal(
											quoteOption,
											customerViewMode
												? quote.issuer.owner
													.defaultVatRate
												: data.me.defaultVatRate,
										)}
									</SideActions>
								</FlexRow>
							</QuoteDisplayMain>
						);
					}
				}}
			</Query>
		);
	}
}

export default withRouter(QuoteDisplay);
