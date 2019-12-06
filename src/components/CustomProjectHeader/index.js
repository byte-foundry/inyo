import css from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";

import fbt from "../../fbt/fbt.macro";
import { useQuery } from "../../utils/apollo-hooks";
import { BREAKPOINTS } from "../../utils/constants";
import { P, primaryBlack, primaryGrey } from "../../utils/new/design-system";
import { GET_PROJECT_INFOS } from "../../utils/queries";
import TasksProgressBar from "../TasksProgressBar";

const Container = styled("div")`
	position: relative;
	${props =>
		props.backgroundUrl
			? css`
					background: url(${props.backgroundUrl});
					background-size: cover;
					padding: 7rem;
					margin: -3rem -3rem 4rem -3rem;
			  `
			: css`
					margin-bottom: 5rem;
			  `}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin-bottom: 1rem;
	}
`;

const ContentContainer = styled("div")`
	max-width: 1280px;
	margin: auto;
`;

const Heading = styled("span")`
	color: ${primaryBlack};
	font-size: 2rem;
	margin-bottom: 1rem;
	background: rgba(255, 255, 255, 0.8);
	padding: 0 5px;
	display: inline-block;
	border-radius: 10px;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		font-size: 1rem;
	}
`;

const AttributionLink = styled(P)`
	color: ${primaryGrey};
	position: absolute;
	bottom: 0;
	right: 20px;
	background: #ffffff6b;
	padding: 0 10px;
	border: 1px;
	border-radius: 15px;
	font-size: 10px;

	a {
		color: inherit;
	}

	&:hover {
		color: ${primaryBlack};
		background: white;
	}
`;

const CustomProjectHeader = ({ projectId, customerToken }) => {
	const token = customerToken === "preview" ? undefined : customerToken;
	const { data, error } = useQuery(GET_PROJECT_INFOS, {
		variables: { projectId, token },
		suspend: true
	});

	if (error) throw error;

	const { project } = data;
	const { banner } = project.issuer;

	return (
		<Container backgroundUrl={banner && (banner.url || banner.urls.full)}>
			<ContentContainer>
				<Heading>{project.name}</Heading>
				<TasksProgressBar
					project={project}
					customerToken={customerToken}
				/>
			</ContentContainer>
			{banner && banner.urls && (
				<AttributionLink>
					<fbt desc="custom project header unsplash attribution link">
						Photo par{" "}
						<fbt:param name="unsplashProfileUrl">
							<a
								rel="noopener"
								href={`https://unsplash.com/@${banner.user.username}?utm_source=inyo&utm_medium=referral`}
							>
								{banner.user.name}
							</a>
						</fbt:param>{" "}
						sur{" "}
						<fbt:param name="unsplashUrl">
							<a
								rel="noopener"
								href="https://unsplash.com/?utm_source=inyo&utm_medium=referral"
							>
								Unsplash
							</a>
						</fbt:param>
					</fbt>
				</AttributionLink>
			)}
		</Container>
	);
};

export default CustomProjectHeader;
