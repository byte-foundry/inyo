import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {ArianneElem} from '../ArianneThread';

import {GET_ALL_CUSTOMERS} from '../../utils/queries';

const CustomersDropdown = (props) => {
	const {data, errors} = useQuery(GET_ALL_CUSTOMERS);

	if (errors) throw errors;

	return <ArianneElem list={data.me.customers} {...props} />;
};

export default CustomersDropdown;
