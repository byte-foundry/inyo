import React, { Component } from 'react';
import styled from 'react-emotion';
import { H3 } from '../../../utils/content';

const SeeQuoteMain = styled('div')`
`;

class SeeQuote extends Component {
  render() {
    return (
        <SeeQuoteMain>
            <H3>See your quote</H3>
        </SeeQuoteMain>
    );
  }
}

export default SeeQuote;
