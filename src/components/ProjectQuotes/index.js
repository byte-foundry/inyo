import styled from '@emotion/styled/macro';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {FlexColumn, FlexRow, LoadingLogo} from '../../utils/content';
import {
	ISSUE_QUOTE,
	UPDATE_PROJECT_QUOTE,
	UPDATE_SECTION,
} from '../../utils/mutations';
import {
	A,
	Button,
	Input,
	lightGrey,
	P,
	primaryBlack,
	primaryPurple,
	SubHeading,
	TaskIcon,
} from '../../utils/new/design-system';
import {GET_PROJECT_QUOTES} from '../../utils/queries';
import useUserInfos from '../../utils/useUserInfos';
import MaterialIcon from '../MaterialIcon';
import RichTextEditor from '../RichTextEditor';

const BudgetItemRow = styled(FlexRow)`
	color: ${({finished}) => (finished ? primaryPurple : primaryBlack)};
	padding-left: 2.5rem;
	margin-top: 0.2rem;

	font-size: 1rem;

	${TaskIcon} {
		width: 2rem;
		height: 2rem;
		transform: scale(0.75);
		margin: 0;
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;

		${TaskIcon} {
			left: 1rem;
		}
	}
`;

const FlexRowSection = styled(FlexRow)`
	display: grid;
	grid-template-columns: 2fr 1fr;

	font-size: 1.2rem;
`;

const BudgetItemName = styled('div')`
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const BudgetItem = ({item}) => (
	<BudgetItemRow finished={item.status === 'FINISHED'}>
		<TaskIcon noAnim status={item.status} type={item.type} />
		<BudgetItemName>{item.name}</BudgetItemName>
	</BudgetItemRow>
);

const BudgetItems = styled('div')`
	display: ${({open}) => (open ? 'block' : 'none')};
	margin-bottom: ${({open}) => (open ? '2rem' : '0')};
`;

const BudgetSectionName = styled('div')`
	flex: 1;
	display: flex;

	i {
		margin-right: 0.5rem;
	}
`;

const BudgetSectionBudget = styled('div')`
	text-align: right;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		font-size: 0.7rem;
	}
`;

const BudgetSectionContainer = styled(FlexColumn)`
	padding: 0.5rem;
	padding-left: 0;
	border-radius: 3px;
	cursor: pointer;

	&:hover {
		background: ${lightGrey};
	}
`;

const BudgetSectionInput = styled(Input)`
	text-align: right;
	width: 100px;
`;

const BudgetSection = ({
	section, price, defaultDailyPrice, onChangePrice,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<BudgetSectionContainer onClick={() => setOpen(!open)}>
			<FlexRowSection>
				<BudgetSectionName>
					<MaterialIcon
						size="medium"
						icon={open ? 'arrow_drop_down' : 'arrow_right'}
					/>
					{section.name}
				</BudgetSectionName>
				<BudgetSectionBudget>
					<BudgetSectionInput
						type="number"
						value={price}
						onClick={e => e.stopPropagation()}
						onChange={e => onChangePrice(parseFloat(e.target.value))
						}
					/>{' '}
					€
				</BudgetSectionBudget>
			</FlexRowSection>
			<BudgetItems open={open}>
				{section.items.map(item => (
					<BudgetItem
						key={item.id}
						item={item}
						defaultDailyPrice={defaultDailyPrice}
					/>
				))}
			</BudgetItems>
		</BudgetSectionContainer>
	);
};

const Container = styled('div')`
	flex: 1;
`;

const ObjectLink = A.withComponent(Link);

const ProjectQuotes = ({projectId}) => {
	const {defaultDailyPrice, workingTime} = useUserInfos();
	const [quoteCreated, setQuoteCreated] = useState(null);
	const [prices, setPrices] = useState({});
	const {data, error, loading} = useQuery(GET_PROJECT_QUOTES, {
		variables: {id: projectId},
		onCompleted({project}) {
			const defaultPrices = {};

			project.sections.forEach((section) => {
				defaultPrices[section.id]
					= section.price
					|| section.items.reduce(
						(price, t) => price
							+ t.unit
								* workingTime
								* (t.dailyRate || defaultDailyPrice),
						0,
					);
			});

			setPrices(defaultPrices);
		},
	});
	const [updateProject] = useMutation(UPDATE_PROJECT_QUOTE);
	const [updateSection] = useMutation(UPDATE_SECTION);
	const [issueQuote] = useMutation(ISSUE_QUOTE);

	if (error) throw error;
	if (loading) return <LoadingLogo />;

	return (
		<Container>
			<SubHeading>Devis</SubHeading>

			<Button
				onClick={async () => {
					await data.project.sections.map(s => updateSection({
						variables: {
							sectionId: s.id,
							price: null,
						},
					}));

					const defaultPrices = {};
					data.project.sections.forEach((section) => {
						defaultPrices[section.id] = section.items.reduce(
							(price, t) => price
								+ t.unit
									* workingTime
									* (t.dailyRate || defaultDailyPrice),
							0,
						);
					});
					setPrices(defaultPrices);
				}}
			>
				<fbt desc="project quote synchronize prices button">
					Re-synchroniser les prix
				</fbt>
			</Button>

			{quoteCreated ? (
				<P>
					Le devis a bien été créé, vous pouvez le partager avec votre
					client en copiant le lien suivant : {quoteCreated.token}
				</P>
			) : (
				<>
					<RichTextEditor
						placeholder={fbt(
							'En-tête du devis...',
							'quote header placeholder',
						)}
						onChange={value => updateProject({
							variables: {id: projectId, quoteHeader: value},
						})
						}
						defaultValue={data.project.quoteHeader}
					/>
					{data.project.sections.map(section => (
						<BudgetSection
							key={section.id}
							section={section}
							price={prices[section.id] || 0}
							defaultDailyPrice={defaultDailyPrice}
							onChangePrice={(price) => {
								setPrices({...prices, [section.id]: price});
								updateSection({
									variables: {sectionId: section.id, price},
								});
							}}
						/>
					))}
					<RichTextEditor
						placeholder={fbt(
							'Pied de page du devis...',
							'quote footer placeholder',
						)}
						onChange={value => updateProject({
							variables: {id: projectId, quoteFooter: value},
						})
						}
						defaultValue={data.project.quoteFooter}
					/>
					<Button
						onClick={async () => {
							const response = await issueQuote({
								variables: {
									projectId,
									header: data.project.quoteHeader,
									footer: data.project.quoteFooter,
									sections: data.project.sections.map(
										section => ({
											name: section.name,
											price: prices[section.id],
										}),
									),
								},
							});

							setQuoteCreated(response.data.issueQuote);
						}}
					>
						<fbt desc="project generate quote button">
							Générer un nouveau devis
						</fbt>
					</Button>
				</>
			)}

			<SubHeading>Devis générés</SubHeading>
			<ul>
				{data.project.quotes.map(quote => (
					<li key={quote.id}>
						<ObjectLink
							to={`/app/${
								data.project.customer
									? data.project.customer.token
									: data.project.token
							}/quotes/${quote.id}`}
						>
							{quote.id}
						</ObjectLink>{' '}
						{new Date(quote.createdAt).toLocaleString()}
					</li>
				))}
			</ul>
		</Container>
	);
};

export default ProjectQuotes;
