import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {ArianneElem} from '../ArianneThread';

import {GET_ALL_CUSTOMERS} from '../../utils/queries';

const CustomersDropdown = ({creatable, ...props}) => {
	const {data, errors} = useQuery(GET_ALL_CUSTOMERS);

	if (errors) throw errors;

	if (creatable) {
		data.me.customers.push({id: 'CREATE', name: 'Créer un nouveau client'});
	}

	return <ArianneElem list={data.me.customers} {...props} />;
};

export default CustomersDropdown;
