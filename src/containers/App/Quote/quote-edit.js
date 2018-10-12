import React, {Component} from 'react';
import styled from 'react-emotion';
import TextEditor from '../../../components/TextEditor';
import QuoteSection from '../../../components/QuoteSection';
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
const PriceElem = styled('div')``;
const QuoteSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 15vw;
	border: 1px solid black;
`;

const CenterContent = styled(FlexColumn)`
	border: 1px solid black;
`;

const quoteSampleData = [
	{
		title: 'Section 1 title',
		tasks: [
			{
				name: 'Name of the task',
				amount: 3,
				price: 1500,
			},
			{
				name: 'Name of the task',
				amount: 3,
				price: 1500,
			},
			{
				name: 'Name of the task',
				amount: 3,
				price: 1500,
			},
		],
	},
	{
		title: 'Section 2 title',
		tasks: [
			{
				name: 'Name of the task',
				amount: 3,
				price: 1500,
			},
		],
	},
];

class EditQuote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'quote',
			proposalContent: undefined,
		};
	}

	render() {
		return (
			<EditQuoteMain>
				<FlexRow justifyContent="space-between">
					<H1>Create your quote</H1>
					<Button>Send proposal</Button>
				</FlexRow>
				<FlexRow>
					<H3>Name of the project</H3>
				</FlexRow>
				<FlexRow justifyContent="space-between">
					<SideActions justifyContent="space-between">
						<div>
							<div>
								<label>Template</label>
							</div>
							<Select>
								<option value="website">Website</option>
								<option value="logo">Logo</option>
							</Select>
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
									active={this.state.mode === 'proposal'}
									onClick={(raw) => {
										this.setState({mode: 'proposal'});
									}}
								>
									Proposal
								</ToggleButton>
								<ToggleButton
									active={this.state.mode === 'quote'}
									onClick={(raw) => {
										this.setState({mode: 'quote'});
									}}
								>
									Quote
								</ToggleButton>
							</div>
							<Button>Add option</Button>
						</FlexRow>
						<FlexColumn>
							{this.state.mode === 'quote' ? (
								<QuoteSections>
									{quoteSampleData.map(section => (
										<QuoteSection data={section} />
									))}
								</QuoteSections>
							) : (
								<TextEditor
									onChange={(raw) => {
										this.setState({proposalContent: raw});
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
							<option value="optionA">Option A</option>
							<option value="optionB">Option B</option>
						</Select>
						<PriceElem>
							<H6>Time scheduled</H6>
							<H4>15 days</H4>
						</PriceElem>
						<PriceElem>
							<H6>Total H.T.</H6>
							<H4>5000 €</H4>
						</PriceElem>
						<PriceElem>
							<H6>Total T.T.C</H6>
							<H4>6000 €</H4>
						</PriceElem>
					</SideActions>
				</FlexRow>
			</EditQuoteMain>
		);
	}
}

export default EditQuote;
