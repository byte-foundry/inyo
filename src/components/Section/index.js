import React, {Component} from 'react';
import styled from 'react-emotion';

import {H4} from '../../utils/content';

import TasksList from '../TasksList';

const SectionMain = styled('div')``;

class Section extends Component {
	render() {
		const {items, name, options} = this.props;

		return (
			<SectionMain>
				<H4>{name}</H4>
				<TasksList tasks={items} options={options} />
			</SectionMain>
		);
	}
}

export default Section;
