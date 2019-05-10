import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {ArianneElemCreatable} from '../ArianneThread';

import {GET_USER_TAGS} from '../../utils/queries';
import {TAG_COLOR_PALETTE} from '../../utils/constants';

const TagDropdown = (props) => {
	const {loading, data, errors} = useQuery(GET_USER_TAGS, {suspend: false});

	if (errors) throw errors;

	if (loading) return false;

	const onCreateOption = (name) => {
		const [colorBg, colorText] = TAG_COLOR_PALETTE[
			data.me.tags.length % TAG_COLOR_PALETTE.length
		].map(
			color => `#${color.map(p => p.toString(16).padStart(2, '0')).join('')}`,
		);

		props.onCreateOption(name, colorBg, colorText);
	};

	return (
		<ArianneElemCreatable
			list={data.me.tags}
			isMulti
			{...props}
			onCreateOption={onCreateOption}
		/>
	);
};

export default TagDropdown;
