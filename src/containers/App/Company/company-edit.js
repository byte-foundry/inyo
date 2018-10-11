import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';

const CompanyEditMain = styled('div')``;

class CompanyEdit extends Component {
	render() {
		return (
			<CompanyEditMain>
				<H3>Edit your company</H3>
			</CompanyEditMain>
		);
	}
}

export default CompanyEdit;
