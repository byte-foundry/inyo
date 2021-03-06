import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {formatName} from '../../utils/functions';
import {GET_ALL_CUSTOMERS} from '../../utils/queries';
import {ArianneElem} from '../ArianneThread';

const CustomersDropdown = ({creatable, ...props}) => {
	const {data, errors} = useQuery(GET_ALL_CUSTOMERS, {suspend: true});

	if (errors) throw errors;
	const customers = data.me.customers.map(customer => ({
		...customer,
		name: `${customer.name} (${formatName(
			customer.firstName,
			customer.lastName,
		)})`,
	}));

	if (creatable) {
		customers.unshift({
			id: 'CREATE',
			name: (
				<fbt
					project="inyo"
					desc="customer dropdown create new customer"
				>
					Créer un nouveau client
				</fbt>
			),
		});
	}

	return <ArianneElem list={customers} {...props} />;
};

export default CustomersDropdown;
