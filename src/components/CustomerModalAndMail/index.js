import React, {useState} from 'react';

import CustomerIntroMail from '../CustomerIntroMail';
import CustomerModal from '../CustomerModal';

function CustomerModalAndMail({
	onDismiss,
	onValidate,
	customer,
	close,
	...rest
}) {
	const [createdCustomer, setCreatedCustomer] = useState(false);

	return createdCustomer ? (
		<CustomerIntroMail
			customer={createdCustomer}
			onDismiss={() => {
				onValidate(createdCustomer);
				close();
			}}
		/>
	) : (
		<CustomerModal
			{...rest}
			customer={customer}
			onDismiss={onDismiss}
			onValidate={onValidate}
			onCustomerWasCreated={(customer) => {
				onValidate(customer);
				setCreatedCustomer(customer);
			}}
		/>
	);
}

export default CustomerModalAndMail;
