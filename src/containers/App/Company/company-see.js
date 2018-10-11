import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';

const CompanySeeMain = styled('div')``;

class CompanySee extends Component {
	render() {
		return (
			<CompanySeeMain>
				<H3>See your company</H3>
			</CompanySeeMain>
		);
	}
}

export default CompanySee;
