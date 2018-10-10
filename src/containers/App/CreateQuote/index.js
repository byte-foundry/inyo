import React, { Component } from 'react';
import styled from 'react-emotion';
import { withRouter } from "react-router-dom";
import SearchQuoteForm from '../../../components/SearchQuoteForm';
import QuoteList from '../../../components/QuoteList';
import { H1 } from '../../../utils/content';

const CreateQuoteMain = styled('div')`
`;

class CreateQuote extends Component {
  render() {
    return (
      <CreateQuoteMain>
        <H1>Create your quote</H1>
      </CreateQuoteMain>
    );
  }
}

export default CreateQuote;
