import React, {Component} from 'react';
import styled from 'react-emotion';
import {H4, H5, FlexRow} from '../../utils/content';

const QuoteSectionMain = styled('div')``;
const QuoteAddItem = styled('button')``;

class QuoteSection extends Component {
	render() {
		const {data} = this.props;

		return (
			<QuoteSectionMain>
				<H4>{data.title}</H4>
				{data.tasks.map(task => (
					<FlexRow justifyContent="space-around">
						<H5>{task.name}</H5>
						<span>{task.amount}</span>
						<span>{task.price}€</span>
					</FlexRow>
				))}
				<QuoteAddItem>Add item</QuoteAddItem>
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
