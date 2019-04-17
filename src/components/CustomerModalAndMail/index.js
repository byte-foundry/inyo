import React, {useState} from 'react';

import CustomerIntroMail from '../CustomerIntroMail';
import CustomerModal from '../CustomerModal';

function CustomerModalAndMail({onDismiss, onValidate, ...rest}) {
	const [createdCustomer, setCreatedCustomer] = useState(false);

	return createdCustomer ? (
		<CustomerIntroMail
			customer={createdCustomer}
			onDismiss={() => {
				onDismiss();
			}}
		/>
	) : (
		<CustomerModal
			{...rest}
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
