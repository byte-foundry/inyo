import React, {Component} from 'react';
import styled from 'react-emotion';
import {Route} from 'react-router-dom';

import {Query} from 'react-apollo';
import {
	FlexRow, FlexColumn, H1, ToggleButton,
} from '../../../utils/content';

import {GET_QUOTE_DATA_WITH_TOKEN} from '../../../utils/queries';

import TasksProgressBar from '../../../components/TasksProgressBar';
import Section from '../../../components/Section';
import CustomerNameAndAddress from '../../../components/CustomerNameAndAddress';
import IssuerNameAndAddress from '../../../components/IssuerNameAndAddress';
import CommentModal from '../../../components/CommentModal';
import TextEditor from '../../../components/TextEditor';

const TasksListUserMain = styled('div')``;
const TLTopBar = styled(FlexRow)``;
const TLCustomerName = styled('label')`
	flex: 1;
`;
const TLTimeIndicators = styled(FlexColumn)``;
const TLTimeLabel = styled('div')``;
const TLTimeValue = styled('div')``;

const SideActions = styled(FlexColumn)`
	min-width: 15vw;
	padding: 20px 40px;
`;

class TasksListUser extends Component {
	constructor(props) {
		super(props);
		this.state = {mode: 'proposal'};
	}

	render() {
		const {quoteId, customerToken} = this.props.match.params;

		return (
			<Query
				query={GET_QUOTE_DATA_WITH_TOKEN}
				variables={{quoteId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					const {
						quote: {
							name,
							customer,
							issuer,
							options: [{sections, proposal}],
						},
					} = data;

					const customerOptions = {
						noAddItem: true,
						noValidation: true,
						noItemEdition: true,
						seeCommentsNotification: true,
					};

					const sectionsElems = sections.map(section => (
						<Section
							items={section.items}
							name={section.name}
							id={section.id}
							options={customerOptions}
						/>
					));

					return (
						<TasksListUserMain>
							<H1>{name}</H1>
							<TasksProgressBar
								tasksCompleted={1}
								tasksTotal={5}
							/>
							<FlexColumn>
								<FlexRow>
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
								</FlexRow>
								<FlexRow>
									<SideActions>
										<IssuerNameAndAddress issuer={issuer} />
									</SideActions>
									{this.state.mode === 'quote' ? (
										<FlexColumn>{sectionsElems}</FlexColumn>
									) : (
										<TextEditor
											currentContent={proposal}
											onChange={() => {}}
										/>
									)}
									<SideActions>
										<CustomerNameAndAddress
											customer={customer}
										/>
									</SideActions>
								</FlexRow>
							</FlexColumn>
							<Route
								path={`${
									this.props.match.path
								}/comments/:itemId`}
								component={CommentModal}
							/>
						</TasksListUserMain>
					);
				}}
			</Query>
		);
	}
}

export default TasksListUser;
