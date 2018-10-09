import React, { Component } from 'react';
import styled from 'react-emotion';
import { P } from '../../../utils/content';
const AppIndexMain = styled('div')`
`;

class AppIndex extends Component {
  render() {
    return (
        <AppIndexMain>
          <P>
            This is the app page
          </P>          
        </AppIndexMain>
    );
  }
}

export default AppIndex;
