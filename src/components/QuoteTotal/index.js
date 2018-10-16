import React, {Component} from 'react';
import styled from 'react-emotion';

import {H4, H6} from '../../utils/content';

const PriceElem = styled('div')``;

class Task extends Component {
	render() {
		const {sumDays, sumHT, sumTTC} = this.props;

		return (
			<div>
				<PriceElem>
					<H6>Time scheduled</H6>
					<H4>{sumDays} days</H4>
				</PriceElem>
				<PriceElem>
					<H6>Total H.T.</H6>
					<H4>{sumHT} €</H4>
				</PriceElem>
				<PriceElem>
					<H6>Total T.T.C</H6>
					<H4>{sumTTC} €</H4>
				</PriceElem>
			</div>
		);
	}
}

export default Task;
