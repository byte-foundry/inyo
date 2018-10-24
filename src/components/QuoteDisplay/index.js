import React, {Component} from 'react';
import styled from 'react-emotion';
import {withRouter} from 'react-router-dom';
import {Mutation, Query} from 'react-apollo';
import Select from 'react-select';

import CustomerNameAndAddress from '../CustomerNameAndAddress';
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
} from '../../utils/mutations';
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
	max-width: 1600px;
	margin-left: auto;
	margin-right: auto;
`;

const BackButton = styled(Button)`
	padding: 10px 5px;
	font-size: 11px;
	margin-bottom: 10px;
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
	margin: 0;
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

class QuoteDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'quote',
			selectedOption: undefined,
			apolloTriggerRenderTemporaryFix: false,
		};
	}

	getQuoteTotal = (option) => {
		let sumDays = 0;
		let sumHT = 0;
		let sumTTC = 0;

		option.sections.forEach((section) => {
			section.items.forEach((item) => {
				sumDays += item.unit;
				sumHT += item.unitPrice;
				sumTTC
					+= item.unitPrice + item.unitPrice * (item.vatRate / 100);
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
			timePlanned,
			amendmentEnabled,
			overtime,
		} = this.props;

		return (
			<QuoteDisplayMain>
				<BackButton
					theme="Link"
					size="XSmall"
					onClick={() => this.props.history.push('/app/quotes')}
				>
					Retour à la liste des devis
				</BackButton>
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
										sendQuote(quote.id, SendQuote);
									}}
								>
									Envoyez la proposition
								</SendQuoteButton>
							)}
						</Mutation>
					</QuoteRow>
				)}
				<QuoteRow noPadding justifyContent="space-between">
					<FlexColumn>
						<QuoteName>
							<Mutation mutation={UPDATE_QUOTE}>
								{updateQuote => (
									<InlineEditable
										value={quote.name}
										type="text"
										placeholder="Name of the project"
										disabled={mode !== 'edit'}
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
								tasksCompleted={totalItemsFinished}
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
										setQuoteData(e.value, EditItems);
									}}
									options={quoteTemplates}
								/>
							)}
						</Mutation>
					)}
					{mode === 'see' && (
						<FlexRow>
							<QuoteStatus>
								<span>Temps prévu : {timePlanned}</span>
								<span>Dépassement : {overtime}</span>
							</QuoteStatus>
							<Mutation mutation={SEND_AMENDMENT}>
								{SendAmendment => (
									<SendQuoteButton
										theme="Primary"
										disabled={!amendmentEnabled}
										size="Medium"
										onClick={() => {
											sendAmendment(
												quote.id,
												SendAmendment,
											);
										}}
									>
										Envoyez l'avenant
									</SendQuoteButton>
								)}
							</Mutation>
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
											(section, index) => (
												<QuoteSection
													key={`section${section.id}`}
													data={section}
													addItem={addItem}
													editItem={editItem}
													mode={mode}
													editSectionTitle={
														editSectionTitle
													}
													removeItem={removeItem}
													removeSection={
														removeSection
													}
													sectionIndex={index}
												/>
											),
										)}
										{mode === 'edit' && (
											<Mutation mutation={ADD_SECTION}>
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
														Ajouter une section
													</QuoteAction>
												)}
											</Mutation>
										)}
									</QuoteSections>
								) : (
									<Mutation mutation={UPDATE_OPTION}>
										{UpdateOption => (
											<TextEditor
												disabled={mode !== 'edit'}
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
						<CustomerNameAndAddress customer={quote.customer} />
						{this.getQuoteTotal(quoteOption)}
					</SideActions>
				</FlexRow>
			</QuoteDisplayMain>
		);
	}
}

export default withRouter(QuoteDisplay);
