import React, {Component} from 'react';
import styled from 'react-emotion';

import {H4, H6, primaryNavyBlue} from '../../utils/content';

const TotalMain = styled('div')`
	margin-top: 10px;
`;
const TotalElem = styled('div')`
	padding-top: 15px;
	padding-bottom: 15px;
`;
const TotalLabel = styled(H6)`
	font-size: 13px;
	margin: 0;
	margin-bottom: 10px;
	text-transform: uppercase;
`;
const TotalNumber = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
`;

class ProjectTotal extends Component {
	render() {
		const {sumDays, label, counter} = this.props;

		return (
			<TotalMain>
				<TotalElem>
					<TotalLabel>{label}</TotalLabel>
					<TotalNumber>
						{sumDays} {counter}
					</TotalNumber>
				</TotalElem>
			</TotalMain>
		);
	}
}

export default ProjectTotal;
