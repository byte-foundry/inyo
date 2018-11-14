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
	UPDATE_PROJECT,
	ADD_SECTION,
	UPDATE_OPTION,
	SEND_PROJECT,
	SEND_AMENDMENT,
	ACCEPT_AMENDMENT,
	REJECT_AMENDMENT,
	ACCEPT_PROJECT,
	REJECT_PROJECT,
	REMOVE_PROJECT,
} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import {dateDiff} from '../../utils/functions';
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
	signalRed,
	Loading,
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

const InfoMessage = styled(P)`
	color: ${primaryBlue};
	font-size: 11px;
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
	width: fill-available;
	margin-left: auto;
	margin-right: auto;
	padding-bottom: 40px;
`;

const QuoteAction = styled(Button)`
	text-decoration: none;
	color: ${props => (props.theme === 'DeleteOutline' ? signalRed : primaryBlue)};
	font-size: 13px;
	transform: translateY(18px);
	margin-top: 10px;
	margin-bottom: 10px;
`;

const QuoteStatus = styled(FlexColumn)`
	span {
		font-size: 13px;
		margin: 5px 20px;
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
	padding: 0.5em 1em;
	margin-bottom: 0.5em;
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
			askForInfos,
			timePlanned,
			amendmentEnabled,
			overtime,
			issuer,
			refetch,
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
					if (loading) return <Loading />;
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
										Retour à la liste des projets
									</BackButton>
								)}
								{mode === 'edit' && (
									<QuoteRow justifyContent="space-between">
										<QuoteDisplayTitle>
											Remplissez votre projet
										</QuoteDisplayTitle>
										<Mutation
											mutation={SEND_PROJECT}
											onError={(error) => {
												if (
													error.message.includes(
														'NEED_MORE_INFOS',
													)
													|| error.message.includes(
														'Missing required data',
													)
												) {
													return askForInfos();
												}
											}}
										>
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
													Envoyer la proposition
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
											<Mutation mutation={UPDATE_PROJECT}>
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
									</FlexColumn>
									{mode === 'see' && (
										<FlexRow>
											{!customerViewMode
												&& quote.status !== 'SENT' && (
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
										</FlexRow>
									)}
								</QuoteRow>
								<FlexRow justifyContent="space-between">
									<CenterContent flexGrow="2">
										<QuoteContent>
											{mode === 'see' && (
												<TasksProgressBar
													tasksCompleted={
														totalItemsFinished
													}
													tasksTotal={totalItems}
												/>
											)}
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
																	defaultDailyPrice={
																		!customerViewMode
																		&& data.me
																			.defaultDailyPrice
																	}
																	refetch={
																		refetch
																	}
																	quoteStatus={
																		quote.status
																	}
																/>
															),
														)}
														{mode === 'edit'
															&& quote.status
																!== 'SENT' && (
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
									<SideActions justifyContent="space-between">
										<div>
											{issuer.name && (
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
										</div>
										{mode === 'edit' && (
											<Mutation mutation={REMOVE_PROJECT}>
												{RemoveQuote => (
													<QuoteAction
														theme="DeleteOutline"
														size="XSmall"
														type="delete"
														onClick={() => {
															this.props.removeQuote(
																quote.id,
																RemoveQuote,
															);
														}}
													>
														Supprimer le brouillon
													</QuoteAction>
												)}
											</Mutation>
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
