import React, {Component} from 'react';
import styled from 'react-emotion';

import {H4} from '../../utils/content';

import TasksList from '../TasksList';

const SectionMain = styled('div')`
	width: 70%;
`;

class Section extends Component {
	render() {
		const {items, name} = this.props;

		return (
			<SectionMain>
				<H4>{name}</H4>
				<TasksList tasks={items} />
			</SectionMain>
		);
	}
}

export default Section;
