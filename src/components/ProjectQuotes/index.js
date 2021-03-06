import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {FlexColumn, FlexRow, LoadingLogo} from '../../utils/content';
import {isCustomerTask} from '../../utils/functions';
import {
	ISSUE_QUOTE,
	UPDATE_PROJECT_QUOTE,
	UPDATE_SECTION,
} from '../../utils/mutations';
import {
	A,
	Button,
	CheckBoxFakeLabel,
	CheckBoxLabel,
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
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import RichTextEditor from '../RichTextEditor';

const BudgetItemRow = styled('li')`
	list-style-type: circle;
`;

const QuoteCreatedConfirmation = styled(P)`
	background-color: #e8ffe8;
	padding: 1rem;
	border-radius: 8px;
	margin: 2rem 0;
`;

const FlexRowSection = styled(FlexRow)`
	display: grid;
	grid-template-columns: 2fr 1fr;

	font-size: 1.2rem;
`;

const BudgetItemName = styled('div')``;

const BudgetItem = ({item}) => (
	<BudgetItemRow>
		<BudgetItemName>{item.name}</BudgetItemName>
	</BudgetItemRow>
);

const BudgetItems = styled('ul')`
	display: ${({open}) => (open ? 'block' : 'none')};
	margin-bottom: ${({open}) => (open ? '2rem' : '0')};

	padding-left: 4rem;
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

const Total = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

const PriceWithoutTaxes = styled(Total)`
	font-size: 1.5rem;
	margin: 1rem 0;
	font-weight: 500;
`;

const PriceWithTaxes = styled(Total)`
	margin: 1.5rem 0;
`;

const TotalSection = styled('div')`
	font-size: 1.2rem;
	margin: 1rem 0;
	flex: 1;
	display: flex;
	flex-direction: column;
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
					<fbt desc="budget input">
						<fbt:param name="input">
							<BudgetSectionInput
								type="text"
								value={price}
								onClick={e => e.stopPropagation()}
								onChange={e => onChangePrice(parseFloat(e.target.value))
								}
							/>
						</fbt:param>{' '}
						€
					</fbt>
				</BudgetSectionBudget>
			</FlexRowSection>
			<BudgetItems open={open}>
				{section.items
					.filter(
						item => item.type !== 'PERSONAL'
							&& !isCustomerTask(item.type),
					)
					.map(item => (
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

const Actions = styled('div')`
	margin-bottom: 2rem;
	display: flex;
	justify-content: flex-end;
`;

const ProjectQuotes = ({projectId}) => {
	const {defaultDailyPrice, vatRate, vat} = useUserInfos();
	const [hasTaxes, setHasTaxes] = useState(!!vat);
	const [taxRate, setTaxRate] = useState(vatRate);

	useEffect(() => {
		setHasTaxes(!!vat);
		setTaxRate(vatRate);
	}, [vat, vatRate]);

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
						(price, t) => price + t.unit * (t.dailyRate || defaultDailyPrice),
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
			<Actions>
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
										* (t.dailyRate === undefined
										|| t.dailyRate === null
											? defaultDailyPrice
											: t.dailyRate),
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
			</Actions>

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
			<TotalSection>
				<Total>
					<PriceWithoutTaxes>
						<fbt desc="total">Total HT</fbt>
						<span style={{padding: '0 0.5rem'}}>
							<fbt desc="total price">
								<fbt:param name="price">
									{Object.keys(prices)
										.reduce(
											(acc, priceKey) => acc + prices[priceKey],
											0,
										)
										.toFixed(2)}
								</fbt:param>{' '}
								€
							</fbt>
						</span>
					</PriceWithoutTaxes>
				</Total>

				<CheckBoxLabel
					checked={hasTaxes}
					style={{justifyContent: 'flex-end', marginRight: '1rem'}}
				>
					<input
						type="checkbox"
						checked={hasTaxes}
						onChange={e => setHasTaxes(e.target.checked)}
					/>
					{hasTaxes ? (
						<IconButton
							icon="check_box"
							size="tiny"
							color={primaryPurple}
						/>
					) : (
						<IconButton
							icon="check_box_outline_blank"
							size="tiny"
							color={primaryPurple}
						/>
					)}
					<CheckBoxFakeLabel>
						<fbt project="inyo" desc="quote with taxes">
							Devis avec taxes
						</fbt>
					</CheckBoxFakeLabel>
				</CheckBoxLabel>
				{hasTaxes && (
					<div>
						<Total>
							<div>
								<fbt desc="vat">TVA</fbt>
							</div>
							<div style={{padding: '0 0.5rem'}}>
								<BudgetSectionInput
									type="number"
									value={taxRate}
									onChange={e => setTaxRate(e.target.value)}
								/>{' '}
								%
							</div>
						</Total>

						<PriceWithTaxes>
							<fbt desc="total">Total TTC</fbt>
							<div style={{padding: '0 0.5rem'}}>
								<fbt desc="total price">
									<fbt:param name="price">
										{(
											Object.keys(prices).reduce(
												(acc, priceKey) => acc + prices[priceKey],
												0,
											)
											* (1 + taxRate / 100)
										).toFixed(2)}
									</fbt:param>{' '}
									€
								</fbt>
							</div>
						</PriceWithTaxes>
					</div>
				)}
			</TotalSection>
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
			{data.project.customer ? (
				<Actions>
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
											items: section.items
												.filter(
													item => item.type
															!== 'PERSONAL'
														&& !isCustomerTask(
															item.type,
														),
												)
												.map(item => ({
													name: item.name,
												})),
										}),
									),
									hasTaxes,
									taxRate,
								},
							});

							setQuoteCreated(response.data.issueQuote);
						}}
					>
						<fbt desc="project generate quote button">
							Générer un nouveau devis
						</fbt>
					</Button>
				</Actions>
			) : (
				<Actions>
					<fbt desc="add client before creating a quote">
						Ajouter un client pour pouvoir créer un devis
					</fbt>
				</Actions>
			)}
			{quoteCreated && (
				<QuoteCreatedConfirmation>
					<fbt desc="quote is created">
						Le devis a bien été créé, vous pouvez le partager avec
						votre client en copiant le lien suivant:
					</fbt>{' '}
					<ObjectLink
						to={`/app/${
							data.project.customer
								? data.project.customer.token
								: data.project.token
						}/quotes/${quoteCreated.id}`}
						target="_blank"
					>
						<fbt desc="quote created issue number">
							Devis N° 2020-<fbt:param name="issueNumber">
								{quoteCreated.issueNumber}
							</fbt:param>
						</fbt>
					</ObjectLink>
				</QuoteCreatedConfirmation>
			)}

			{data.project.quotes.length > 0 && (
				<>
					<SubHeading>
						<fbt desc="generated quotes">Devis générés</fbt>
					</SubHeading>
					<ul>
						{[...data.project.quotes]
							.sort(
								(a, b) => moment(b.createdAt).valueOf()
									- moment(a.createdAt).valueOf(),
							)
							.map(quote => (
								<li key={quote.id}>
									<ObjectLink
										to={`/app/${
											data.project.customer
												? data.project.customer.token
												: data.project.token
										}/quotes/${quote.id}`}
										target="_blank"
									>
										<fbt desc="quote link label number">
											Devis N° 2020-<fbt:param name="issueNumber">
												{quote.issueNumber}
											</fbt:param>
										</fbt>
									</ObjectLink>{' '}
									{moment(quote.createdAt).format('L')}{' '}
									{quote.acceptedAt && (
										<span>
											<fbt desc="accepted at">
												Accepté le{' '}
												<fbt:param name="date">
													{moment(
														quote.acceptedAt,
													).format('L')}
												</fbt:param>
											</fbt>
										</span>
									)}
								</li>
							))}
					</ul>
				</>
			)}
		</Container>
	);
};

export default ProjectQuotes;
