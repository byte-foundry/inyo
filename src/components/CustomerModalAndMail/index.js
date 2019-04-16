import React, {useState} from 'react';

import CustomerIntroMail from '../CustomerIntroMail';
import CustomerModal from '../CustomerModal';

function CustomerModalAndMail({...rest}) {
	const [createdCustomer, setCreatedCustomer] = useState(false);

	return createdCustomer ? (
		<CustomerIntroMail {...rest} />
	) : (
		<CustomerModal
			{...rest}
			onCustomerWasCreated={() => setCreatedCustomer(true)}
		/>
	);
}

export default CustomerModalAndMail;
