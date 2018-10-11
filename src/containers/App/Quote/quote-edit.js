import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';

const EditQuoteMain = styled('div')``;

class EditQuote extends Component {
	render() {
		return (
			<EditQuoteMain>
				<H3>Edit your quote</H3>
			</EditQuoteMain>
		);
	}
}

export default EditQuote;
