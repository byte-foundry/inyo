import React, { Component } from 'react';
import styled from 'react-emotion';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CompanyEdit from './company-edit';
import CompanyCreate from './company-create';
import CompanySee from './company-see';
import { H3 } from '../../../utils/content';

const CompanyMain = styled('div')`
`;

class Company extends Component {
  render() {
    return (
        <Router>
            <CompanyMain>
                <Route exact path="/app/company" component={CompanySee} />
                <Route path="/app/company/edit" component={CompanyEdit} />
                <Route path="/app/company/create" component={CompanyCreate} />
            </CompanyMain>
        </Router>
    );
  }
}

export default Company;
