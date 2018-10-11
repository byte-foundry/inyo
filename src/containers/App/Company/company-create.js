import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';
import UserCompanyForm from '../../../components/UserCompanyForm';

const CompanyCreateMain = styled('div')``;

class CompanyCreate extends Component {
	render() {
		return (
			<CompanyCreateMain>
				<H3>Create your company</H3>
				<UserCompanyForm />
			</CompanyCreateMain>
		);
	}
}

export default CompanyCreate;
