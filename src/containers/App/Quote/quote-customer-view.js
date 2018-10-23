import React, {Component} from 'react';
import styled from 'react-emotion';

import {Query} from 'react-apollo';
import {FlexRow, FlexColumn, H1} from '../../../utils/content';

import {GET_QUOTE_DATA_WITH_TOKEN} from '../../../utils/queries';

import TasksProgressBar from '../../../components/TasksProgressBar';
import Section from '../../../components/Section';
import CustomerNameAndAddress from '../../../components/CustomerNameAndAddress';
import IssuerNameAndAddress from '../../../components/IssuerNameAndAddress';

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
							options: [{sections}],
						},
					} = data;

					const customerOptions = {
						noAddItem: true,
						noValidation: true,
						noItemEdition: true,
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
							<FlexRow>
								<SideActions>
									<IssuerNameAndAddress issuer={issuer} />
								</SideActions>
								<FlexColumn>{sectionsElems}</FlexColumn>
								<SideActions>
									<CustomerNameAndAddress
										customer={customer}
									/>
								</SideActions>
							</FlexRow>
						</TasksListUserMain>
					);
				}}
			</Query>
		);
	}
}

export default TasksListUser;
