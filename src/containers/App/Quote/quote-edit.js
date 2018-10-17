import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation, Query} from 'react-apollo';
import TextEditor from '../../../components/TextEditor';
import InlineEditable from '../../../components/InlineEditable';
import QuoteSection from '../../../components/QuoteSection';
import QuoteTotal from '../../../components/QuoteTotal';
import {templates} from '../../../utils/quote-templates';
import {EDIT_ITEMS} from '../../../utils/mutations';
import {GET_QUOTE_DATA} from '../../../utils/queries';
import {
	H1,
	H3,
	H5,
	H4,
	H6,
	P,
	FlexRow,
	FlexColumn,
} from '../../../utils/content';

const EditQuoteMain = styled('div')`
	min-height: 600px;
`;

const Select = styled('select')``;
const Button = styled('button')``;
const ToggleButton = styled('span')`
	color: ${props => (props.active ? 'black' : 'grey')};
	cursor: pointer;
	margin-right: 20px;
`;
const AddOptionButton = styled('button')``;
const ClientAddress = styled('div')``;
const QuoteSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 15vw;
	border: 1px solid black;
	padding: 20px 40px;
`;

const CenterContent = styled(FlexColumn)`
	border: 1px solid black;
	padding: 20px 40px;
`;

class EditQuote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'quote',
			quoteData: {
				name: 'Name of the project',
				proposal: undefined,
				sections: [],
			},
		};
	}

	setQuoteData = (templateName, EditItemItems) => {
		const templateData = templates.find(e => e.name === templateName);

		if (templateData) {
			const items = templateData.sections.flatMap(section => section.items.map(item => item.name));

			if (typeof EditItemItems === 'function') {
				EditItemItems({variables: {items}});
			}
			this.setState({quoteData: templateData});
		}
		else {
			this.setState({
				quoteData: {
					name: '',
					proposal: undefined,
					sections: [],
				},
			});
			if (typeof EditItemItems === 'function') {
				EditItemItems({variables: {items: []}});
			}
		}
	};

	getQuoteTotal = () => {
		let sumDays = 0;
		let sumHT = 0;
		let sumTTC = 0;

		this.state.quoteData.sections.forEach((section) => {
			section.items.forEach((item) => {
				sumDays += item.amount;
				sumHT += item.price;
				sumTTC += item.price;
			});
		});
		return <QuoteTotal sumDays={sumDays} sumHT={sumHT} sumTTC={sumTTC} />;
	};

	editQuoteTitle = (title) => {
		this.setState({
			quoteData: {
				...this.state.quoteData,
				name: title,
			},
		});
	};

	addItem = (sectionIndex) => {
		const {sections} = this.state.quoteData;

		sections[sectionIndex].items.push({
			name: 'New item',
			amount: 0,
			price: 0,
			comment: '',
		});
		this.setState({
			quoteData: {
				...this.state.quoteData,
				sections,
			},
		});
	};

	editItem = (sectionIndex, itemIndex, data) => {
		const {sections} = this.state.quoteData;

		sections[sectionIndex].items[itemIndex] = data;
		this.setState({
			quoteData: {
				...this.state.quoteData,
				sections,
			},
		});
	};

	removeItem = (sectionIndex, itemIndex) => {
		const {sections} = this.state.quoteData;

		sections[sectionIndex].items.splice(itemIndex, 1);
		this.setState({
			quoteData: {
				...this.state.quoteData,
				sections,
			},
		});
	};

	addSection = () => {
		const {sections} = this.state.quoteData;

		sections.push({
			title: 'New section name',
			items: [],
		});
		this.setState({
			quoteData: {
				...this.state.quoteData,
				sections,
			},
		});
	};

	removeSection = (sectionIndex) => {
		const {sections} = this.state.quoteData;

		sections.splice(sectionIndex, 1);
		this.setState({
			quoteData: {
				...this.state.quoteData,
				sections,
			},
		});
	};

	editSectionTitle = (sectionIndex, title) => {
		const {sections} = this.state.quoteData;

		sections[sectionIndex].title = title;
		this.setState({
			quoteData: {
				...this.state.quoteData,
				sections,
			},
		});
	};

	componentDidMount() {
		// placeholder
		this.setQuoteData('Website');
	}

	render() {
		const {quoteData} = this.state;
		const {quoteId} = this.props.match.params;

		return (
			<Query query={GET_QUOTE_DATA} variables={{quoteId}}>
				{({loading, error, data}) => {
					console.log(data);
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					return (
						<EditQuoteMain>
							<FlexRow justifyContent="space-between">
								<H1>Fill your quote data</H1>
								<Button
									onClick={() => {
										console.log(this.state.quoteData);
									}}
								>
									Send proposal
								</Button>
							</FlexRow>
							<FlexRow>
								<H3>
									<InlineEditable
										value={quoteData.name}
										type="text"
										placeholder="Name of the project"
										onFocusOut={(value) => {
											this.editQuoteTitle(value);
										}}
									/>
								</H3>
							</FlexRow>
							<FlexRow justifyContent="space-between">
								<SideActions justifyContent="space-between">
									<div>
										<div>
											<label>Template</label>
										</div>
										<div>
											<Mutation mutation={EDIT_ITEMS}>
												{EditItems => (
													<Select
														onChange={(e) => {
															this.setQuoteData(
																e.target.value,
																EditItems,
															);
														}}
													>
														{templates.map(
															template => (
																<option
																	value={
																		template.name
																	}
																>
																	{
																		template.name
																	}
																</option>
															),
														)}
														<option value="custom">
															New template
														</option>
													</Select>
												)}
											</Mutation>
										</div>
										<Button>Save draft</Button>
									</div>
									<div>
										<Button>Add an attachment</Button>
										<p>Portfolio.pdf</p>
									</div>
								</SideActions>
								<CenterContent flexGrow="2">
									<FlexRow justifyContent="space-between">
										<div>
											<ToggleButton
												active={
													this.state.mode
													=== 'proposal'
												}
												onClick={(raw) => {
													this.setState({
														mode: 'proposal',
													});
												}}
											>
												Proposal
											</ToggleButton>
											<ToggleButton
												active={
													this.state.mode === 'quote'
												}
												onClick={(raw) => {
													this.setState({
														mode: 'quote',
													});
												}}
											>
												Quote
											</ToggleButton>
										</div>
										<Button>Add option</Button>
									</FlexRow>
									<FlexColumn fullHeight>
										{this.state.mode === 'quote' ? (
											<QuoteSections>
												{quoteData.sections.map(
													(section, index) => (
														<QuoteSection
															data={section}
															addItem={() => {
																this.addItem(
																	index,
																);
															}}
															editItem={
																this.editItem
															}
															editSectionTitle={
																this
																	.editSectionTitle
															}
															removeItem={
																this.removeItem
															}
															sectionIndex={index}
															removeSection={() => {
																this.removeSection(
																	index,
																);
															}}
														/>
													),
												)}
												<Button
													onClick={() => {
														this.addSection();
													}}
												>
													Add section
												</Button>
											</QuoteSections>
										) : (
											<TextEditor
												currentContent={
													quoteData.proposal
												}
												templateName={quoteData.name}
												onChange={(raw) => {
													this.setState({
														quoteData: {
															...quoteData,
															proposal: raw,
														},
													});
												}}
											/>
										)}
									</FlexColumn>
								</CenterContent>
								<SideActions>
									<ClientAddress>
										<H5>Michel Renard</H5>
										<P>666 rue yorkshire</P>
										<P>69003 Lyon</P>
										<P>France</P>
									</ClientAddress>
									<Select>
										<option value="optionA">
											Option A
										</option>
										<option value="optionB">
											Option B
										</option>
									</Select>
									{this.getQuoteTotal()}
								</SideActions>
							</FlexRow>
						</EditQuoteMain>
					);
				}}
			</Query>
		);
	}
}

export default EditQuote;
