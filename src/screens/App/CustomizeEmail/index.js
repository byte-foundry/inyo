import styled from "@emotion/styled";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import CustomEmailSidebar from "../../../components/CustomEmailSidebar";
import EmailCustomizer from "../../../components/EmailCustomizer";
import { FlexRow } from "../../../utils/content";
import { BREAKPOINTS } from "../../../utils/constants";
import {
	Container,
	Content,
	Heading,
	HeadingRow
} from "../../../utils/new/design-system";

const EmailContainer = styled("div")`
	flex: 1;
	max-width: 1200px;
	margin: 3.5rem auto;
`;

const Main = styled("div")`
	min-height: 100vh;
	display: flex;
	flex: 1;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
	}
`;

const CustomizeEmail = () => {
	const emailCategories = [
		{
			name: "CUSTOMER",
			types: [
				{
					name: "DELAY"
				},
				{
					name: "FIRST"
				},
				{
					name: "SECOND"
				},
				{
					name: "LAST"
				}
			]
		},
		{
			name: "CUSTOMER_REPORT",
			types: [
				{
					name: "CUSTOMER_REPORT"
				}
			]
		},
		{
			name: "CONTENT_ACQUISITION",
			types: [
				{
					name: "DELAY"
				},
				{
					name: "FIRST"
				},
				{
					name: "SECOND"
				},
				{
					name: "LAST"
				}
			]
		},
		{
			name: "INVOICE",
			types: [
				{
					name: "INVOICE_DELAY"
				},
				{
					name: "INVOICE_FIRST"
				},
				{
					name: "INVOICE_SECOND"
				},
				{
					name: "INVOICE_THIRD"
				},
				{
					name: "INVOICE_FOURTH"
				},
				{
					name: "INVOICE_LAST"
				}
			]
		}
	];

	//This will change depending on the email type
	const emailType = {
		availableParams: [
			{
				name: "task.name",
				label: "Nom de la tâche"
			},
			{
				name: "task.description",
				label: "Description de la tâche"
			},
			{
				name: "user.firstName",
				label: "Votre prénom"
			},
			{
				name: "user.lastName",
				label: "Votre nom de famille"
			},
			{
				name: "customer.fullName",
				label: "Nom complet du client"
			},
			{
				name: "assistant.name",
				label: "Nom de l'assistant"
			}
		]
	};

	return (
		<Switch>
			<Route path="/app/emails/:category/:type">
				<Container>
					<Main>
						<EmailContainer>
							<HeadingRow>
								<Heading>
									<fbt project="inyo" desc="emails">
										Modèles d'emails
									</fbt>
								</Heading>
							</HeadingRow>
							<FlexRow>
								<CustomEmailSidebar
									categories={emailCategories}
								/>
								<EmailCustomizer emailType={emailType} />
							</FlexRow>
						</EmailContainer>
					</Main>
				</Container>
			</Route>
			<Redirect
				to={`/app/emails/${emailCategories[0].name}/${emailCategories[0].types[0].name}`}
			/>
		</Switch>
	);
};

export default CustomizeEmail;
